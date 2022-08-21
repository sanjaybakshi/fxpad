class TfileUtils
{

    static getFileFromZip(filename, zipFile)
    {
	JSZip.loadAsync(body).then(function (zip) {
	    return zip.file("content.txt").async("string");
	}).then(function (text) {
	    console.log(text);
	});
    }

    static async getAllFilesFromZip(zipFile)
    {
	let fHandles = []
	let fNames   = []
	
	await JSZip.loadAsync(zipFile).then(function(content) {
			    
	    for(let [filename, file] of Object.entries(content.files)) {
		fNames.push(filename)
		fHandles.push(file)
	    }
	})

	return {fileNames: fNames, fileHandles: fHandles}
    }

    static async readFileFromZip_string(zipFileHandle)
    {
	const content = await zipFileHandle.async('string')
	return content
					
    }

    static async readFileFromZip_binary(zipFileHandle)
    {
	//const content = await zipFileHandle.async('base64')
	const content = await zipFileHandle.async('blob')	
	return content
					
    }

    
    static async getFilesFromZip(zipFile, extension)
    {
	    
	let fHandles = []
	let fNames   = []
	    
	const content = await JSZip.loadAsync(zipFile)
	
	for(let [filename, file] of Object.entries(content.files)) {

	    if (filename.endsWith(extension)) {
		fNames.push(filename)
		fHandles.push(file)
	    }
	}

	return {fileHandles: fHandles, fileNames: fNames}
    }
    
    
    static filePicker()
    {
	return new Promise((resolve, reject) => {

	    let input = document.createElement('input');
	    input.type = 'file';

	    
	    function getFiles()
	    {
	    }
	    
	    input.onchange = () => resolve(input.files)
	    
	    input.click();
	})
    }

    static async getImageFromBlob(blob)
    {
	return new Promise((resolve,reject) => {
	    var image = new Image()
	    image.src = URL.createObjectURL(blob)
	    image.onload = () => {
		resolve(image)
	    }
	    image.onerror = e => {
		reject(e)
	    }
	})
    }
}

export default TfileUtils
