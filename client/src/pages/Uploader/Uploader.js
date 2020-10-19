import React from "react"
import Dropzone from "react-dropzone"
import { Button, Jumbotron, FormGroup, Label, Input, Form } from 'reactstrap';
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
    const image = this.state.image;
    image.append("image", acceptedFiles[0]);
    this.setState({ image });
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
    axios.post(`/api/photos/upload`, this.state.image).then(res =>{
      const { title, caption } = this.state
      const { imageUrl } = res.data
      axios.post(`/api/photos/saveinfo`, {title, caption, imageUrl}).then(res=>{
        console.log(res)
      });
    });
  }

  render() {

    return (
      <Jumbotron>
          <Dropzone multiple={false} maxSize={10000000} onDrop={this.onDrop}>
            {({ getRootProps, getInputProps }) => (
              <span {...getRootProps()}>
                <input {...getInputProps()} />
                <Button>Add image</Button>
              </span>
            )}
          </Dropzone>
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
          <Button className="login-button" id="login-button"
                  disabled={
                    !(
                      this.state.title &&
                      this.state.caption &&
                      this.state.image
                    )
                  }
                  onClick={() => this.save()}
                >
                  Save
          </Button>
        </Form>
      </Jumbotron>
    );

  }
}


export default Uploader