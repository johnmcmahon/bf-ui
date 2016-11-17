# Shoreline Detection Use Case 1
- This is a simple workflow showing the ability to submit a set of images that make up a scene to Beachfront and get back a set of candidate shorelines.
- Detection algorithms themselves are independent of this workflow. They can be changed or updated at will as they become available.

## Data Models
### Detection Inputs
- Beachfront credentials
- Image(s) (Data ID)
- Image metadata
   - ground sample distance
   - source (e.g., LandSat8)
   - footprint
   - cloud cover
   - other as needed
- Area of Interest (GeoJSON Geometry)
- Algorithm ID
- Algorithm executable command
   - Input file(s)
   - Output file(s)
   - Additional parameters

### Detected Shorelines
GeoJSON Feature Collection
- features
  - geometry
  - metadata

## Concept of Operations
### High Level
<img src="http://www.websequencediagrams.com/files/render?link=LhPYRz-eoRRS6HKebjAy"/>
[original file](https://www.websequencediagrams.com/?lz=dGl0bGUgRGV0ZWN0IFNob3JlbGluZSAxCgphdXRvbnVtYmVyIDEKCnBhcnRpY2lwYW50IEFuYWx5c3QABw1QaWF6emEKCk5vdGUgb3ZlcgAeCCwAFAc6IAogIFByZWNvbmRpdGlvbnM6IFNlcnZpY2UgcmVnaXN0cmF0aW9uCmVuZCBub3RlCgoAYQctPgBqBzogU2VsZWN0IGltYWdlIHRvIGFuYWx5egAfDHJlZgB5BgBuCACBSxBzCiAgU2UAgWEScwB0BXJlZi0tPgBnCnByb3Bvc2VkIHMANgoAgQUTUmV2aWV3ABkV&s=magazine&h=8DBkhQ_DauiElTPS)

#### Preconditions
These activities are out of scope for this use case, but required for it to be successful.

###### Cloud Deployment
- [x] bf-handle
- [x] pzsvc-exec
- [x] Detection algorithm
- [x] tide service

###### Service Registration
The following services are registered into ~~Piazza~~ the environment so that bf-ui can find them:
- [x] bf-handle
- [x] pzsvc-exec / pzsvc-ossim (the detection algorithm)

#### Information Exchange: Discover Algorithms
###### Request - GET /service

###### Response
- Piazza service list

###### Security
The request requires authentication and authorization with Piazza.

#### Function: Authentication
The user is presented with an authentication challenge. 
The user provides credentials via OAUTH2 which are verified by an IdAM component.

#### Function: Get Available Services
[Registered Services](#registered-services) are loaded from the environment

#### Function: Select Input Parameters
[Detection Inputs](#detection-inputs)

#### Shoreline Detection Execution - [see below](#shoreline-detection-execution)

#### Display Detected Shorelines - [see below](#display-detected-shorelines)

### Asynchronous Action (pattern)
<img src="http://www.websequencediagrams.com/files/render?link=PSQ3ecG5LfFwcsvn3YM5"/> [original file](https://www.websequencediagrams.com/#open=184352)

This pattern is used throughout and is indicated by a bar around the swim lane.

#### Information Exchange: Request
###### Request
In most cases these asynchronous requests require authentication and authorization. Therefore the requests will be wrapped in a JWT that contains the security assertion for that user.
- JSON Web Token (JWT) 
   - Security Assertion
   - variable

###### Response
- Job ID

#### Function: Operation
- update job status
- variable

#### Information Exchange: Authenticate
Authentication is through an externally controlled system.
###### Request
- authentication token

###### Response
- confirmation

#### Information Exchange: Authorize
Authorization is through an internally controlled system 
that manages users and roles.
###### Request
- authorization token
- role

###### Response
- confirmation

#### Information Exchange: Log
###### Request
- User ID
- Operation
- Operation status

###### Response: N/A

#### Information Exchange: Get Status
###### Request
- variable

###### Response
- status

#### Information Exchange: Get Results
###### Request
- variable

###### Response
- variable

### Shoreline Detection Execution
<img src="http://www.websequencediagrams.com/files/render?link=Klw1cF-FDHcXUVajNkBK"/>
[original file](https://www.websequencediagrams.com/#open=133238)

#### Information Exchange: Detect Shorelines
###### Request (Async)
- [Detection Inputs](#detection-inputs)

###### Response
- An appropriate error -OR-
- File Identifier for Detected Shorelines

###### Security
The request requires authentication and authorization with Beachfront

#### Function Prepare Executable Call
- Build executable command

#### Information Exchange: Execute
###### Request (Async)
- [Detection Inputs](#detection-inputs)

###### Response
- An appropriate error -OR-
- Process outputs
  - File Identifier for Detected Shorelines

###### Security
The request requires authentication and authorization with Beachfront

#### Information Exchange: Get File [see below](#get-file)

#### Information Exchange: Execute Algorithm
###### Request (EXECUTE)
- [Detection Inputs](#detection-inputs)

###### Response
- Error message -OR-
- [Detected Shorelines](#detected-shorelines) (GeoJSON)

The executable may output its response in the file provided

#### Function: Algorithm Execution

#### Function: Inspect Results (pzsvc-exec)

#### Information Exchange: Store Detected Shorelines [see below](#ingest-file)
- [Detected Shorelines](#detected-shorelines) (GeoJSON)

#### Function: Compose Response

#### Function: Inspect Results (bf-handle)

#### Information Exchange: Update File Metadata [see below](#update-file-metadata)

#### Information Exchange: Metadata Injection [see below](#metadata-injection)

#### Information Exchange: Deploy File [see below](#deploy-file)

#### Function: Cleanup
Cleanup activities like the following may be performed.
- Delete input file
- Delete output file

### Get File
<img src="http://www.websequencediagrams.com/files/render?link=jvzUD9TbAYdAbhNeckH7"/>[original file](https://www.websequencediagrams.com/#open=184563)

#### Information Exchange: Get File (from Piazza)
###### Request: GET /file/{dataId}
- Piazza credentials
- File ID

###### Response
- File

###### Security
The request requires authentication and authorization with Piazza

#### Function: Retrieve file from storage (Piazza)
Out of scope

#### Information Exchange: Get File (Trusted or Untrusted File Service)
###### Request (Client or Ingester)
- Vendor-specific credentials
- URL
   - File ID

###### Response
- File

###### Security
In most cases the request requires authentication and authorization 
with the file provider (e.g., Planet Labs)

#### Function: Retrieve file from storage (File Service)
Out of scope

#### Information Exchange: Get File (Untrusted Service via Ingester)
###### Request (Async)
- Vendor-specific credentials
- File ID

###### Response
- File

###### Security
In most cases the request requires authentication and authorization 
with the file provider. It may separately require A/A with the ingester
(AKA dirty bucket/clean bucket).

#### Function: Sanitize File
out of scope

### Ingest File
<img src="http://www.websequencediagrams.com/files/render?link=CN9dbaVTIhMTLUbLOjr5"/> [original file](https://www.websequencediagrams.com/#open=141890)

#### Information Exchange: Ingest File 
###### Request
* File (POST) -OR-
* File URL
* Piazza credentials

###### Response (Async)
- Job Status
- If Complete
  - Location of Ingested File

###### Security
The request requires authentication and authorization 
with the owner of the file bucket (e.g., Piazza).

#### Information Exchange: Store File 
###### Request
* File (POST) -OR-
* File URL

###### Response N/A

### Update File Metadata
<img src="http://www.websequencediagrams.com/files/render?link=o6iD927xwL_FMR3vboSo"/>[original file](https://www.websequencediagrams.com/#open=184556)

#### Information Exchange: Update Metadata
###### Request
* File (PUT)
* Security token

###### Response N/A

###### Security
The request requires authentication and authorization 
with the owner of the file bucket (e.g., Piazza).

### Metadata Injection
<img src="http://www.websequencediagrams.com/files/render?link=c0gl1Avulh5x2w7lGxlk"/>[original file](https://www.websequencediagrams.com/#open=177674)

#### Information Exchange: Get File [see above](#get-file)
The file is the [Detected Shorelines](#detected-shorelines) GeoJSON.

#### Function: Collect Centroid
We need to pick a single point for each scene. 
Large scenes will have lower tide accuracy as you move away from the centroid.

#### Information Exchange: Get Tide
###### Request
- Date/time (YYYY-MM-DD-hh-mm)
- lat
- lon

###### Response
- Date/time
- lat
- lon
- results
  - 24h Max
  - 24h Min
  - Tide amount

###### Security
The request may require authentication and authorization 
with the owner of the tide prediction service.

#### Function: Update Metadata
Each feature has its metadata updated based on tide information
and whatever else is already on hand.

#### Information Exchange: Ingest File [see above](#ingest-file)
Re-ingest the file and get a new file ID.

### Deploy File
<img src="http://www.websequencediagrams.com/files/render?link=zcB_Y1rADqVSojC3DmXB"/>[original file](https://www.websequencediagrams.com/#open=184557)

#### Information Exchange: Deploy File
###### Request
- Piazza Credentials
- File

###### Response
- Deployment ID

###### Security
The request requires authentication and authorization 
with the owner of the WFS (e.g., Piazza).

#### Function: Deploy File
out of scope

### Display Detected Shorelines
<img src="http://www.websequencediagrams.com/files/render?link=cz5Ci8sds4AnusoP-vna"/> [original file](https://www.websequencediagrams.com/#open=143835)

#### Information Exchange: Get Map
###### Request
- GetMap request

###### Response
- Map image

#### Function: Display Map

#### Information Exchange: Get File [see above](#get-file)
The requested file is the Detected Shorelines

#### Function: Review Detected Shorelines [see below](#review-detection)

### Detection Review
<img src="http://www.websequencediagrams.com/files/render?link=6JY0mf7cgq0XMgi0m96i"/>
[original file](https://www.websequencediagrams.com/#open=140039)

*Note: This has not been implemented yet.*

#### Information Exchange: Review Detection
###### Request
- Detection Review Parameters
  - Location of detected shorelines
  - Bounding box of detected shorelines
- Continuation Options
  - Select baseline shorelines from feature repository
  - Store baseline shorelines in key/value store
  - Call bf-analyze with detected shorelines, detected shorelines

###### Response
- Job Status
- If complete
  - [Detection Analysis Results](#detection-analysis-results)

#### Information Exchange: Get Baseline Features
###### Request
- Get Feature request
  - Feature type
  - Bounding box

###### Response
- Features (GeoJSON)

#### Function: Perform Analysis
1. Qualitative analysis
1. Quantitative analysis
1. Write output file

#### Information Exchange: Publish Analysis Results
###### Request
- [Detection Analysis Results](#detection-analysis-results)

###### Response - N/A


