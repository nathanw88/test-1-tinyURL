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
      signedUrl: "",
      image: new FormData
    };
  }

  componentDidMount() {
    let { signedUrl } = this.state;
    //grab photo just uploaded by id
    axios.get(`/api/photos/uploadUrl`).then(res => {

      this.setState({ signedUrl: res.data })
    })
  }
  //Saves image to state
  onDrop = (acceptedFile, maxSize, lossyQuality = .95) => {
    let { image, imageUploaded } = this.state;
    const file = acceptedFile[0];
    let img = document.getElementById("compressedImage")

    let dataUrlToFile = (src) => {
      return (fetch(src)
        .then((res) => { return res.arrayBuffer(); })
        .then((buf) => { return new File([buf], this.state.title, { type: "png" }) })
        .then((file) => {
          image.append("image", file);
          imageUploaded = true;
          this.setState({ image, imageUploaded })
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

    let canvas = document.createElement("canvas")
    let reader = new FileReader();
    reader.onload = function (e) { img.src = e.target.result }
    reader.readAsDataURL(file);

    let ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    const { width, height } = getSize()
    console.log(width + " " + height)
    canvas.width = width;
    canvas.height = height;
    ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, width, height);

    let dataUrl = canvas.toDataURL("image/png", lossyQuality);

    dataUrlToFile(dataUrl);
    // this.setState({ imageUrl, imageUploaded })

    // let { image, imageUploaded} = this.state;
    // image.append("image", acceptedFiles[0]);
    // this.setState({ image, imageUploaded });
  };

  removeImage = () => {
    let { image, imageUploaded } = this.state;
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
    const { signedUrl, image } = this.state;

    //Send image data to backend to save to google cloud
    // axios.post(`/api/photos/upload`, this.state.image).then(res => {

    console.log(this.state)
    let url = `https://cors-anywhere.herokuapp.com/${signedUrl}`;
    
    axios({
      method: "put",
      url: signedUrl,
      header:{"content-type": "application/octet-stream"},
      body: image.get("image"),
    }).then(res => {
      console.log(res)
    })

    const uploadHandler = async () => {
      try {
        const response = await fetch(signedUrl, {
          method: 'PUT',
          body: image.get("image"),
        });
        console.log(response)
      } catch (error) {
        console.error('Error:', error);
      }
    };

    uploadHandler()

    // const { title, caption } = this.state
    // const { imageUrl } = res.data
    // axios.post(`/api/photos/saveinfo`, { title, caption, imageUrl }).then(res => {
    //   window.location.replace(`/photos/${res.data}`)
    // });
    // });
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
                  <Button> Browse Files!</Button>
                </div>
              </section>
            )}
          </Dropzone>
          <div className="imageContainer">
            <img id="compressedImage" src="" alt="No picture uploaded" sizes="calc(80% - 8px)" />
          </div>
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