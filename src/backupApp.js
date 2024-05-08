import './App.css';
import React, {useState, useEffect} from 'react';
import {v4 as uuid} from 'uuid';
import {list, getProperties, uploadData, getUrl} from 'aws-amplify/storage';

function App() {
  const [images, setImages] = useState([]);
  useEffect(()=>{
    fetchImages();
  }, [])

  async function onChange(e){
    // when a file is uploaded, create a unique name and save it using the Storage API
    const file =  e.target.files[0];
    const fileType = file.name.split('.')[file.name.split.length - 1];

    try{
      const result = await uploadData({
        path: `public/${uuid()}.${fileType}`,
        data: file,
      }).result;
      console.log("Succeeded: ", result);
    } catch (err){
      console.log("Error uploading file: ", err);
    }
    // Once the file is uploaded, fetch the list of images
    fetchImages();
  }

  async function fetchImages(){
    const files = await list('public/');
    console.log("App.js: fetchImages function: files: ", files);

    try {
      const urls = await Promise.all(files.items.map(
        async file=>{
          try{
            const path = `public/${file.key}`;
            const url = await getUrl({path: path});
            return url
          } catch(err){
            console.log("Error getting url: ", err);
          }
        }
      ))
      setImages(urls);
    }catch(err){
      console.log("error getting url: ", err);
    }
  }
  return (
    <div className='App'>
      <header className='App-header'>
        <input type="file" onChange={onChange}/>
        {
          images.map(image => (
            <img
              src={image.url}
              style={{width: 500}}
              alt='Uploaded'
            />
          ))
        }
      </header>
    </div>
  );
}

export default App;
