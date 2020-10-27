live link https://tiny-url-image.herokuapp.com/

This is an app for uploading images to google cloud storage. Upon uploading will redirect to page with photo, the head has meta tags with Open Graph protocol with image url for google cloud storage.

Setting up app on local: after cloning this repository you will need to set up a google cloud storage bucket, setup a service account for the project, and download the JSON google credentials place those anywhere, in utils/imgUpload.js line 6 change the value of keyfilename to the path to the google JSON credentials, while here change the value of projectId on line 5, and bucketName on line 10 to equal your google project name and bucket name. next use the db/scheema.sql to setup a database go config/connetion.js to change database connection credentials.
