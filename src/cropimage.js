import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import { Divider, CircularProgress, Link } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';


class CropImage extends Component{ 

    state = {
        link:null,
        loading:false,
        noremove:true
    }
 
    upload(id){
        this.setState({loading:true, noremove:false});
        let formdata = new FormData();
        this.props.crops[id].toBlob(blob=>{
          formdata.append(0, blob);
    
          axios.post('/upload', formdata, { headers: {'Content-Type':'multipart/form-data'} })
            .then(res=>{
                console.log(res);
                this.setState({loading:false, link:res.data.data.link});
            })
            .catch(err=>{
                console.log(err);
                this.setState({loading:false,link:"Error"})
            });
    
        });
        // console.log(file);
    }
    
    render(){
        return this.props.crops[this.props.id] && 
            (<div>
                <br/><br/>
                <Grid container>
                    <Grid item xs={1}><Typography style={{padding:8, margin:0}}>{this.props.text}</Typography></Grid>
                    <Grid item xs={11}>
                        {this.state.noremove && <Button onClick={e=>{this.upload(this.props.id)}}>Upload to Imgur</Button>}
                        {this.state.loading && <CircularProgress style={{padding:4}} size={16}/>}
                        {this.state.link && (<Typography style={{padding:8}}>Uploaded <Link href={this.state.link}>{this.state.link}</Link></Typography>) }
                    </Grid>
                </Grid>
                <img src={this.props.crops[this.props.id].toDataURL()} id="crop1" alt="crop1" width={this.props.width} /><br/>
            </div>);
    }
}

export default CropImage;
