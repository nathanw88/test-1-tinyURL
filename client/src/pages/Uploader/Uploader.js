import React from "react"
import Dropzone from "react-dropzone"
import { Button, Jumbotron, FormGroup, Label, Input, Form } from 'reactstrap';
import axios from "axios"
import "./Uploader.css"

class Uploader extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      title: "Title",
      caption: "Caption",
      imageUploaded: false,
      image: new FormData(),
      imageUrl: require("../../images/download.png"),
      status: "No Image Loaded"
    };
  }


  //Saves image to state
  onDrop = (acceptedFiles, maxSize, lossyQuality = .95) => {
    let { image, imageUrl, imageUploaded } = this.state;
    this.setState({ status: "Please Wait For Image To Load" })
    const acceptedFile = acceptedFiles[0];
    let reader = new FileReader();
    // let img = document.getElementById("uploadImage")
    reader.onload = (e) => {
      let img = new Image()
      img.src = e.target.result;
      img.onload = () => {
        let canvas = document.getElementById("compressCanvas");

        let dataUrlToFile = (src) => {
          return (fetch(src)
            .then((res) => { return res.arrayBuffer(); })
            .then((buf) => { return new File([buf], this.state.title, { type: "png" }) })
            .then((file) => {
              image.append("image", file);
              imageUploaded = true;
              this.setState({ image, imageUrl, imageUploaded })
            })
          )
        }
        let getSize = () => {
          const { maxWidth, maxHeight } = maxSize;

          let width = img.width;
          let height = img.height;

          if (maxWidth === undefined || maxHeight === undefined) return { width, height }

          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
            }
          }
          return { width, height }
        }
        if (lossyQuality > 1 || lossyQuality > 0) lossyQuality = .95

        console.log(img.width + " " + img.height)

        console.log(img.width + " " + img.height)
        const { width, height } = getSize();
        let ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        canvas.width = width;
        canvas.height = height;
        ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        let dataUrl = canvas.toDataURL("image/png", lossyQuality);
        document.getElementById('uploadImage').src = dataUrl;
        imageUrl = dataUrl
        dataUrlToFile(dataUrl);



      }
    }
    reader.readAsDataURL(acceptedFile);
  };

  removeImage = () => {
    let { image, imageUploaded } = this.state;
    image = new FormData();
    imageUploaded = false;
    this.setState({ image, imageUploaded });
  };


  // handles changes to title and caption
  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  save = () => {
    const { image } = this.state;

    // Send image data to backend to save to google cloud
    axios.post(`/api/photos/upload`, image).then(res => {
      const { title, caption } = this.state
      const { imageUrl } = res.data
      axios.post(`/api/photos/saveinfo`, { title, caption, imageUrl }).then(res => {
        window.location.replace(`/photos/${res.data}`)
      });
    })

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
              <section id="dropzone">
                <div {...getRootProps()}>
                  <input {...getInputProps()} />
                  <p id="dropzoneText">Drag 'n' drop image here, or click to select file </p>
                  <Button> Browse Files!</Button>
                </div>
              </section>
            )}
          </Dropzone>
          <div className="downloadContainer">
          <img src={this.state.imageUrl}/>
          </div>
            <p hidden={this.state.imageUploaded}>{this.state.status}</p>

          <Button onClick={this.removeImage} hidden={!this.state.imageUploaded} id="removeImg"> Remove image &#9746;</Button>

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
        <img hidden={true} id="uploadImage" src='' width={640} height={425} alt="Waiting To Uploaded" />

        <canvas hidden={true} width={640} height={425} id="compressCanvas" />
      </div>
    );

  }
}


export default Uploader