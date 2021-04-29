const fs = require('fs')
const path = require('path')
const jwt = require('jsonwebtoken')
const { security, uploadDir: { uploadPath, uploadUrl } } = require('@config')

/***
 *
 */
const findMembers = (instance, { prefix, specifiedType, filter }) => {
    // 递归函数
    function _find(instance) {
        //基线条件（跳出递归）
        if (instance.__proto__ === null) return []

        let names = Reflect.ownKeys(instance)
        names = names.filter(name => {
            // 过滤掉不满足条件的属性或方法名
            return _shouldKeep(name)
        })

        return [...names, ..._find(instance.__proto__)]
    }

    function _shouldKeep(value) {
        if (filter) {
            if (filter(value)) {
                return true
            }
        }
        if (prefix) if (value.startsWith(prefix)) return true
        if (specifiedType) if (instance[value] instanceof specifiedType) return true
    }

    return _find(instance)
}

const generateToken = (uid, scope) => {
    const secretKey = security.secretKey
    const expiresIn = security.expiresIn
    const token = jwt.sign(
        {
            uid,
            scope
        },
        secretKey,
        {
            expiresIn
        }
    )
    return token
}

const generateRole = role => {
    if (+role === 1) {
        return ['admin']
    }

    if (+role === 2) {
        return ['editor']
    }
}

const createBookFromFile = file => {
    const { basename, fileName, url, unzipUrl } = generateFile(file)
    return {
        fileName: fileName,
        path: `/book/${basename}`, // epub文件相对路径
        filePath: `/book/${basename}`, // epub文件路径
        url: url, // epub文件url
        title: '', // 标题
        author: '', // 作者
        publisher: '', // 出版社
        contents: [], // 目录
        cover: '', // 封面图片URL
        coverPath: '',
        category: 99, // 分类ID
        categoryText: '', // 分类名称
        language: '', // 语种
        unzipPath: `/unzip/${fileName}`, // 解压后的电子书目录
        unzipUrl: unzipUrl, // 解压后的电子书链接
        originalName: file.name // 原文件名
    }
}

const createBookFromData = data => {
    return {
        fileName: data.fileName,
        cover: data.coverPath,
        title: data.title,
        author: data.author,
        publisher: data.publisher,
        bookId: data.fileName,
        language: data.language,
        rootFile: data.rootFile,
        originalName: data.originalName,
        path: data.path || data.filePath,
        filePath: data.path || data.filePath,
        unzipPath: data.unzipPath,
        coverPath: data.coverPath,
        createUser: data.username,
        updateType: data.updateType === 0 ? data.updateType : 1,
        category: data.category || 99,
        categoryText: data.categoryText || '自定义'
    }
}

const generateFile = file => {
    const basename = path.basename(file.path) // 文件上传名
    const dirname = path.dirname(file.path) // 本地文件路径
    const extname = path.extname(file.path) // 后缀
    const fileName = basename.replace(extname, '') // 文件无后缀的name
    const url = `${uploadUrl}/book/${basename}` // 下载URL
    const unzipPath = `${uploadPath}/unzip/${fileName}` // 解压后文件夹路径
    const unzipUrl = `${uploadUrl}/unzip/${fileName}` // 解压后文件夹路径URL
    if (!fs.existsSync(unzipPath)) {
        fs.mkdirSync(unzipPath, { recursive: true }) // 创建电子书解压后的目录
    }

    return {
        basename,
        fileName,
        url,
        unzipPath,
        unzipUrl
    }
}

const generatePath = path => {
    if (path.startsWith('/')) {
        return `${uploadPath}${path}`
    } else {
        return `${uploadPath}/${path}`
    }
}

const generatePathExists = path => {
    if (path.startsWith(uploadPath)) {
        return fs.existsSync(path)
    } else {
        return fs.existsSync(generatePath(path))
    }
}

const delDir = dir => {
    // 读取文件夹中所有文件及文件夹
    const list = fs.readdirSync(dir)
    list.forEach((v, i) => {
        const files = path.resolve(dir, v)
        const pathstat = fs.statSync(files)
        if (pathstat.isFile()) {
            fs.unlinkSync(files)
        } else {
            delDir(files)
        }
    })
    // 删除空文件夹
    fs.rmdirSync(dir)
}

const reset = data => {
    const { path, filePath, coverPath, unzipPath } = data

    if (path && generatePathExists(path)) {
        fs.unlinkSync(generatePath(path))
    }
    // 清除源文件
    if (filePath && generatePathExists(filePath)) {
        fs.unlinkSync(generatePath(filePath))
    }
    // 清除封面图片
    if (coverPath && generatePathExists(coverPath)) {
        fs.unlinkSync(generatePath(coverPath))
    }
    // 清除压缩文件夹
    if (unzipPath && generatePathExists(unzipPath)) {
        delDir(generatePath(unzipPath))
    }
}

module.exports = {
    findMembers,
    generateToken,
    generateRole,
    createBookFromFile,
    createBookFromData,
    generateFile,
    generatePath,
    generatePathExists,
    reset,
    delDir
}
