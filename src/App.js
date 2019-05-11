import React, { Component } from 'react';
import './App.css';
import { Typography } from '@material-ui/core';
import LinearProgress from '@material-ui/core/LinearProgress';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import axios from 'axios';
import CropImage from './cropimage';


class App extends Component{

  state = {
    showCrops: false,
    loading:false,
    crops:[null, null, null, null],
    link:[null, null, null, null],
    error:null
  }

  constructor(props){
    super(props);
    this.fileInput = React.createRef();
  }

  handleChange(e){
    this.setState({error:null, loading:true});

    let file = this.fileInput.current.files[0];
    let regex = /\w+(\.jpg|\.png|\.jpeg|\.gif)/g ;
    if(regex.exec(file.name)){
        this.imageCrop(this, 0, file, 755, 540);
        this.imageCrop(this, 1, file, 540, 365);
        this.imageCrop(this, 2, file, 365, 212);
        this.imageCrop(this, 3, file, 380, 380);
    }else{
      alert("Only image files are allowed");
    }

  }

  imageCrop(context, id, file, newWidth, newHeight, ratio=1){
    var loadTimer;
    var imgObject = new Image();
    imgObject.src = URL.createObjectURL(file);
    imgObject.onLoad = onImgLoaded();
    function onImgLoaded() {
      if (loadTimer != null) clearTimeout(loadTimer);
      if (!imgObject.complete) {
        loadTimer = setTimeout(function() {
          onImgLoaded();
        }, 3);
      } else {
          // if(imgObject.width !== 1024 || imgObject.height !== 1024) return context.setState({error:"Only 1024x1024 sized images are allowed.", loading:false});

          var tnCanvas = document.createElement('canvas');
          var tnCanvasContext = tnCanvas.getContext('2d');
          tnCanvas.width = newWidth; tnCanvas.height = newHeight;
          
          var bufferCanvas = document.createElement('canvas');
          var bufferContext = bufferCanvas.getContext('2d');
          bufferCanvas.width = imgObject.width;
          bufferCanvas.height = imgObject.height;

          let startX = Math.floor((imgObject.width - newWidth)/2);
          let startY = Math.floor((imgObject.height - newHeight)/2);

          bufferContext.drawImage(imgObject, 0, 0);
          tnCanvasContext.drawImage(bufferCanvas, startX, startY, newWidth * ratio, newHeight * ratio,0,0,newWidth,newHeight);

          let obj = context.state.crops;
          obj[id] = tnCanvas;
          // console.log(obj);
          context.setState({crops: obj});
      }
    }
  }
    
  

  render(){

    if(this.state.crops[3] && this.state.loading){
      this.setState({loading:false});
    }

    return (
      <div className="container section">
          <input type="file" id="file" ref={this.fileInput} onChange={e=>this.handleChange(e)}/><br/>
          {this.state.showCrops && <img alt="cropped" id="cropped" src="" width="400"/>}

          <br/>


            {this.state.loading && <LinearProgress />}
            <Typography component="h3" variant="h5">Preview</Typography><br/>

            {this.state.error && <Typography component="h3" variant="h5">{this.state.error}</Typography>}
            <CropImage crops={this.state.crops} id={0} text="755x540" width={755} />
            <CropImage crops={this.state.crops} id={1} text="365x450" width={365} />
            <CropImage crops={this.state.crops} id={2} text="365x212" width={365} />
            <CropImage crops={this.state.crops} id={3} text="380x380" width={380} />
                      
      </div>
    );
  }
}

export default App;
