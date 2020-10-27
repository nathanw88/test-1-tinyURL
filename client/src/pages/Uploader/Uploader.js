import React from "react"
import Dropzone from "react-dropzone"
import { Button, Jumbotron, FormGroup, Label, Input, Form } from 'reactstrap';
import axios from "axios"
import "./Uploader.css"


class Uploader extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      title: "",
      caption: "",
      image: new FormData(),
      imageUploaded: false
    };
  }
  //Saves image to state
  onDrop = acceptedFiles => {
    let { image, imageUploaded} = this.state;
    image.append("image", acceptedFiles[0]);
    imageUploaded = true;
    this.setState({ image, imageUploaded });
  };

  removeImage= ()=>{
    let { image, imageUploaded} = this.state;
    image = new FormData();
    imageUploaded = false;
    this.setState({ image, imageUploaded });
    console.log(this.state)
  };


  // handles changes to title and caption
  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  save = () => {
    //Send image data to backend to save to google cloud
    axios.post(`/api/photos/upload`, this.state.image).then(res => {
      const { title, caption } = this.state
      const { imageUrl } = res.data
      axios.post(`/api/photos/saveinfo`, { title, caption, imageUrl }).then(res => {
        window.location.replace(`/photos/${res.data}`)
      });
    });
  }

  render() {

    return (
      <div id="mainContainer">
        <a href="/">
        <img id="logo" src={require("../../images/logo.png")} alt="Logo" />
          </a>

        <Jumbotron id="uploaderContainer">

          <Dropzone multiple={false} maxSize={10000000} accept="image/*" onDrop={this.onDrop}>
            {({ getRootProps, getInputProps }) => (
              <section>
                <div {...getRootProps()}>
                  <input {...getInputProps()} />
                  <p id="dropzoneText">Drag 'n' drop image here, or click to select file </p>
                </div>
              </section>
            )}
          </Dropzone>
            {this.state.imageUploaded? <p>Image Uploaded  <Button onClick={this.removeImage} id="removeImg"> Remove image &#9746;</Button></p>:<p>No image uploaded</p>}


          <Form>
            <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
              <Label for="title" className="mr-sm-2">Title</Label>
              <Input type="title" name="title" id="title" onChange={this.handleInputChange} value={this.state.title} placeholder="Title" />
            </FormGroup>
            <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
              <Label for="caption" className="mr-sm-2">Caption</Label>
              <Input type="caption" name="caption" id="caption" onChange={this.handleInputChange} value={this.state.caption} placeholder="Caption" />
            </FormGroup>
            <br />
            <Button id="saveButton"
              disabled={
                !(
                  this.state.imageUploaded
                )
              }
              onClick={() => this.save()}
            >
              Save
          </Button>
          </Form>
        </Jumbotron>
      </div>
    );

  }
}


export default Uploader