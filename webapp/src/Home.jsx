import React, { Component } from 'react';
import { Table } from 'reactstrap';
import axios from 'axios';
import uuid from 'uuid/v4';
import mime from 'mime-types';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
    };
    this.onImageUploaded = this.onImageUploaded.bind(this);
  }

  async componentDidMount() {
    const { data } = await axios.get(process.env.ALL_IMAGES_ENDPOINT);
    this.setState({
      items: data.data,
    });
  }

  async onImageUploaded(e) {
    e.preventDefault();
    const file = e.target.files[0];

    const { data } = await axios.get(process.env.PRESIGNED_URL_ENDPOINT, {
      params: {
        type: file.type,
        key: `${uuid()}.${mime.extension(file.type)}}`,
      },
    });
    await axios.put(data.url, file, {
      headers: {
        'Content-Type': file.type,
        'Cache-Control': 'public, max-age=31536000',
      },
    });
    window.location.reload();
  }

  render() {
    const { items } = this.state;
    return (
      <>
        <h1>List of images and their thumbnails</h1>
        <input type='file' onChange={this.onImageUploaded} accept='.jpg, .png, .jpeg .gif' />
        <Table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Thumbnail</th>
            </tr>
          </thead>
          <tbody>
            {items.map((v, k) => (
              <tr>
                <td>
                  <img src={v.name} alt='' style={{ maxWidth: 100 }} />
                </td>
                <td>
                  <img src={v.thumbnail} alt='' />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </>
    );
  }
}

export default Home;
