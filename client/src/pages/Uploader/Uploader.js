import React from "react"
import Dropzone from "react-dropzone"
import { Button } from 'reactstrap';
import axios from "axios"

class Uploader extends React.Component {

  constructor(props) {
    super(props);
   
    this.state = {
      title: "",
      caption: "", 
      image: new FormData()
    };
  }
  //Saves image to state
  onDrop = acceptedFiles => {
    const { image } = this.state
    image.append("image", acceptedFiles[0]);
    
    this.setState ({ image })
    //currently calls save on setting data will be moved to save button after all data is entered  
    this.save()
  }
  
  save = () =>{
     //Send image data to backend to save to google cloud
    axios.post(`/api/photos/upload`, this.state).then(res =>
      console.log(res))
  }

  render() {

    return (
      <Dropzone multiple={false} maxSize = {10000000} onDrop={this.onDrop}>
        {({ getRootProps, getInputProps }) => (
          <span {...getRootProps()}>
            <input {...getInputProps()} />
            <Button>Add image</Button>
          </span>
        )}
      </Dropzone>
    );

  }
}


export default Uploader