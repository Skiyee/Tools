/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */

// 加载模块 - 数据库dao层 API 请勿改动此文件-----------------------------------
const path = require('path');
const fs = require('fs');

const modulesPath = path.join(__dirname, "modules");
const moduleObj = {};
const moduleNames = [];

function findDaoModules(dir){
	const fileList = fs.readdirSync(dir);
	
	fileList.forEach(file => {
		const filePath = path.join(dir, file);
		const stat = fs.statSync(filePath);

		if(stat.isDirectory()){
			return findDaoModules(filePath)
		}

		if(file.endsWith("Dao.js")){
			const moduleName = file.substring(0,file.length - 3)
			moduleNames.push(moduleName)

			try {
				moduleObj[moduleName] = require(filePath);
			} catch (err) {
				console.error(`【异常】加载【${moduleName}】异常，请检查！↓↓↓请查看下方的错误提示↓↓↓`);
				console.error(err);
				console.error(`【异常】加载【${moduleName}】异常，请检查！↑↑↑请查看上方的错误提示↑↑↑`);
			}
		}
	})
}

findDaoModules(modulesPath)

moduleObj.init = function(obj) {
	moduleNames.map((moduleName) => {
		if (typeof moduleObj[moduleName] === "object" && typeof moduleObj[moduleName].init === "function") {
			moduleObj[moduleName].init(obj);
		}
	});
}
module.exports = moduleObj;
// 加载模块 - 数据库dao层 API 请勿改动此文件-----------------------------------

