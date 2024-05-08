# React app using Amplify and AWS lambda functions 
## Getting started
```bash
	npm aws-amplify @aws-amplify/ui-react uuid
	amplify init
```

## Adding a Post-Confirmation Lambda Trigger
Run
```bash
amplify add storage 
amplify push -y
```
**Note** allow all access permissions for authorized memebers as well as for guests   
**Note** to be able to access files with guest memebers, the files should be included in the public folder in the S3 bucket