const fs = require('fs')
const path = require('path')
const AdmZip = require('adm-zip')
const Epub = require('@core/epub')
const xml2js = require('xml2js').parseString
const { generateFile, generateTree } = require('@core/util')
const { uploadDir: { uploadPath, uploadUrl } } = require('@config')

class EpubParse {
    /**
    * @description 解析当前电子书的信息
    * @date 2021-04-25
    * @static
    * @param {*} file
    * @returns
    * @memberof EpubParse
    */
    static parse(file) {
        return new Promise((resolve, reject) => {
            const { basename, fileName } = generateFile(file)
            const bookPath = `${uploadPath}/book/${basename}`
            if (!fs.existsSync(bookPath)) {
                throw new global.errs.NotFound('电子书资源不存在')
            }

            const epub = new Epub(bookPath)
            epub.on('error', err => {
                throw new global.errs.NotFound(err.message)
            })
            epub.on('end', err => {
                if (err) {
                    throw new global.errs.NotFound(err.message)
                } else {
                    const { title, language, creator, creatorFileAs, publisher, cover } = epub.metadata
                    if (!title) {
                        throw new global.errs.NotFound('电子书标题不存在，无法解析')
                    } else {
                        this.title = title
                        this.language = language || 'en'
                        this.author = creator || creatorFileAs || 'unknown'
                        this.publisher = publisher || 'unknown'
                        this.rootFile = epub.rootFile
                        const handleGetImage = (error, imgBuffer, mimeType) => {
                            if (error) {
                                throw new global.errs.NotFound(error.message)
                            } else {
                                const imgData = {}
                                const suffix = mimeType.split('/')[1]
                                const coverPath = `${uploadPath}/img/${fileName}.${suffix}`
                                const coverUrl = `/img/${fileName}.${suffix}`
                                fs.writeFileSync(coverPath, imgBuffer, 'binary')
                                this.coverPath = `/img/${fileName}.${suffix}`
                                this.cover = `${uploadUrl}${coverUrl}`
                                resolve(this)
                            }
                        }
                        try {
                            EpubParse.unzip(file)
                            EpubParse.parseContents(file, epub).then(({ chapters, chapterTree }) => {
                                this.contents = chapters
                                this.contentsTree = chapterTree
                                epub.getImage(cover, handleGetImage)
                            })
                        } catch (error) {
                            throw new global.errs.NotFound(error.message)
                        }
                    }
                }
            })
            epub.parse()
        })
    }
    /**
     * @description 解压当前电子书到指定目录
     * @date 2021-04-25
     * @static
     * @param {*} file
     * @memberof EpubParse
     */
    static unzip(file) {
        const { basename, unzipPath } = generateFile(file)
        const zip = new AdmZip(`${uploadPath}/book/${basename}`) // 解析文件路径 --- 绝对路径
        zip.extractAllTo(unzipPath, true) //解压到当前路径下，并且是否覆盖
    }

    /**
     * @description 解析当前电子书的目录
     * @date 2021-04-25
     * @static
     * @param {*} epub
     * @memberof EpubParse
     */
    static parseContents(file, epub) {
        const { fileName, unzipPath } = generateFile(file)
        // 获取 .ncx 文件名
        // .ncx 文件是电子书的目录顺序文件
        function getNcxFilePath() {
            const manifest = epub && epub.manifest
            const spine = epub && epub.spine
            const ncx = manifest && manifest.ncx
            const toc = spine && spine.toc
            return (ncx && ncx.href) || (toc && top.href)
        }
        /**
        * @description 查询当前目录的父级目录及规定层次
        * @date 2021-04-26
        * @param {*} array
        * @param {number} [level=0]
        * @param {string} [pid='']
        * @returns
        */
        function findParent(array, level = 0, pid = '') {
            return array.map(item => {
                // 没有包含 navPoint 直接赋值
                item.level = level
                item.pid = pid
                // 包含 navPoint 且 navPoint是一个数组
                if (item.navPoint && item.navPoint.length > 0) {
                    item.navPoint = findParent(item.navPoint, level + 1, item['$'].id)
                } else if (item.navPoint) {
                    // navPoint 是一个对象的时候，说明此时有当前这一个子目录，给子目录添加相应字段
                    item.navPoint.level = level + 1
                    item.navPoint.pid = item['$'].id
                }
                return item
            })
        }
        /**
        * @description 将目录转为一维数组
        * @date 2021-04-26
        * @param {*} array
        * @returns
        */
        function flatten(array) {
            return [].concat(
                ...array.map(item => {
                    if (item.navPoint && item.navPoint.length > 0) {
                        return [].concat(item, ...flatten(item.navPoint))
                    } else if (item.navPoint) {
                        return [].concat(item, item.navPoint)
                    } else {
                        return item
                    }
                })
            )
        }

        /**
        * @description 过滤对象无用字段
        * @date 2021-04-26
        * @param {*} obj
        * @param {*} array
        */
        function filterUselessField(obj, array) {
            array.forEach(v => {
                delete obj[v]
            })
        }

        if (!this.rootFile) {
            throw new global.errs.NotFound('电子书目录解析失败')
        } else {
            return new Promise(resolve => {
                const ncxFilePath = `${unzipPath}/${getNcxFilePath()}`
                const xml = fs.readFileSync(ncxFilePath, 'utf-8') // 读取 ncx 文件
                const dir = path.dirname(ncxFilePath).replace(uploadPath, '') // 获取 ncx 文件所在目录相对地址
                // 将 ncx 文件从 xml 转化为 json
                xml2js(
                    xml,
                    {
                        explicitArray: false, // 设置为false时，解析结果不会包裹array
                        ignoreAttrs: false // 解析属性
                    },
                    (err, json) => {
                        if (err) {
                            throw new global.errs.NotFound(err.message)
                        } else {
                            const navMap = json.ncx.navMap // 获取ncx的navMap属性，里面包含实际的章节目录信息
                            // 如果navMap属性不存在navPoint属性，则说明目录不存在
                            if (!navMap.navPoint) {
                                throw new global.errs.NotFound('目录解析失败，navMap.navPoint error')
                            } else {
                                navMap.navPoint = findParent(navMap.navPoint)
                                const newNavMap = flatten(navMap.navPoint)
                                const chapters = []
                                const uselessField = ['$', 'content', 'navLabel', 'navPoint']
                                // epub.flow 是当前电子书的所有目录
                                // navMap.navPoint 是当前电子书的嵌套目录，里面可能包含多个子目录
                                // newNavMap 需要将当前 navMap.navPoint 展开成一维数组，里面是所有的目录，包含父级目录以及子目录
                                newNavMap.forEach((chapter, index) => {
                                    const src = chapter.content['$'].src
                                    chapter.label = chapter.navLabel.text || ''
                                    chapter.bookId = `${src}`
                                    chapter.href = `${dir}/${src}`.replace(`/unzip/${fileName}`, '')
                                    chapter.text = `${uploadUrl}${dir}/${src}` // 生成章节的URL
                                    chapter.navId = chapter['$'].id
                                    chapter.fileName = fileName
                                    chapter.order = index + 1
                                    filterUselessField(chapter, uselessField)
                                    chapters.push(chapter)
                                })
                                const chapterTree = generateTree(chapters) // 将目录转化为树状结构
                                resolve({ chapters, chapterTree })
                            }
                        }
                    }
                )
            })
        }
    }
}

module.exports = { EpubParse }
