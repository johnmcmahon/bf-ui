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

###### Service Registration
The following services are registered into ~~Piazza~~ the environment so that bf-ui can find them:
- [x] bf-handle
- [x] pzsvc-exec / pzsvc-ossim (the detection algorithm)
- [x] tide service

#### Information Exchange: Discover Services
###### Request - GET /service

###### Response
- Piazza service list

###### Security
The request requires authentication and authorization with Piazza.

#### Function: Get Available Services
[Registered Services](#registered-services) are loaded from the environment

#### Function: Select Input Parameters
[Detection Inputs](#detection-inputs)

#### Shoreline Detection Execution - [see below](#shoreline-detection-execution)

#### Display Detected Shorelines - [see below](#display-detected-shorelines)

### Asynchronous Action (pattern)
<img src="http://www.websequencediagrams.com/files/render?link=PSQ3ecG5LfFwcsvn3YM5"/> [original file](https://www.websequencediagrams.com/?lz=dGl0bGUgQXN5bmNocm9ub3VzIEFjdGlvbgoKcGFydGljaXBhbnQgY2xpZW50AAYNc2VydmVyCmF1dG9udW1iZXIgMQoKACIGLT4AFwY6IHJlcXVlc3QKACcGAA4Kb3BlcmEAYgUAEggAXAY6IGtleQpsb29wIHVudGlsIGNvbXBsZXRlCiAAfQcAUgpzdGF0dXMAWgkgAIELBy0tPgBECQAdBgAxCwBeCGluc3BlY3QgcmVzcG9uc2UKZW5kAIEsEWdlABwFdWx0cwCBFhEAEAgK&s=magazine&h=loiifpmuxlmQ9EDk)

This pattern is used throughout and is indicated by a bar around the swim lane.

#### Information Exchange: Request
###### Request
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
that manages users and roles
###### Request
- authorization token
- role

###### Response
- confirmation

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
[original file](https://www.websequencediagrams.com/?lz=dGl0bGUgRGV0ZWN0IFNob3JlbGluZSAxCgphdXRvbnVtYmVyIDEKCnBhcnRpY2lwYW50IGJmLXVpIGFzIGNsaWVudAAPDVBpYXp6YSBhcyBwAAUFCgpOb3RlIG92ZXIAKAc6IAogIFByZWNvbmRpdGlvbnM6IENsb3VkIGRlcGxveW1lbnQsIAogIHNlcnZpY2UgcmVnaXN0cmF0aW9uLAogIGltYWdlIGF2YWlsYWJpbGl0eQplbmQgbm90ZQoKAIENBi0-AHgGOiBEaXNjAHgFUwBIBnMKAIESBi0tPj4AgQgIQQBFBmxlABsKAD8JAIEsCFNlbGVjdCBpbnB1dCBwYXJhbWV0ZXJzCgpyZWYAgVIMCiAgU2VlOgCCQAsAglYGaW9uIEV4ZWN1dGlvbgogIEFuYWx5c3QgYWN0cyBhcyBDAIJFBmVuZCByZWYAbhFJbnNwZWN0IFJlc3VsdHMKYWx0AIMuB2VkAIMtCnMKICAAfhIAgQsHRGlzcGxheQAgFwBxCGVsc2UgRXJyb3IKIACDWQcAgXsKADsIZXJyb3IgbWVzc2FnZQplbmQK&s=magazine&h=P8v6Uw8Ug52ekXmE)

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
<img src="http://www.websequencediagrams.com/files/render?link=jvzUD9TbAYdAbhNeckH7"/>[original file](https://www.websequencediagrams.com/?lz=dGl0bGUgR2V0IEZpbGUKCnBhcnRpY2lwYW50IENsaWVudCBhcyBjAAUFABANSW5nZXN0ZXIgYXMgaQAFBwAxDUZpbGUgU2VydmljZSBhcyBmcwBQDVBpYXp6YSBhcyBwAAUFCgpvcHQgaW1hZ2Ugc3RvcmVkIGluAB8HCiAAewctPgAnBjoAgSgKIAA5By0-AIEfBjoAgUMGZWxzZSBmaWwAQQxpbnRlcm5hbCBzAIEQBgBMC2ZzAEYNZnMALCNleAA2GSsAggoIAIEcDQCCHwgAZQpmAGUKACgKAB0RAEMKU2FuaXRpemUAQBItAIFwDm5kCgo&s=magazine&h=ULJTScp0KAnA_yeC)

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
<img src="http://www.websequencediagrams.com/files/render?link=CN9dbaVTIhMTLUbLOjr5"/> [original file](https://www.websequencediagrams.com/?lz=dGl0bGUgSW5nZXN0IEZpbGUKCnBhcnRpY2lwYW50IEFuYWx5c3QgYXMgYQAFBgASDVBpYXp6YQAlDUZpbGUgQnVja2UAMQVmYgoKADMHLT4AKQY6AGINAD0GLS0-PgBaBzogQWNrbm93bGVkZ2VtZW50ABsIPmZiOlN0b3JlAIEhBwAPCABOCFVwZGF0ZSBTdGF0dXMKCmxvb3AgUmVjdXJyaW5nCiAAgTkIAH0KR2V0ACYIICBhbHQgT3BlcmF0aW9uIEluY29tcGxldGUKICAgAIFhBy0AgRkKAC4JZWxzZQAtC0MAGR1Mb2MAWQZvZgCCbAdlZACCbwYgIGVuZAplbmQK&s=magazine&h=bAyVF-Q3ejWfLb46)

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
<img src="http://www.websequencediagrams.com/files/render?link=o6iD927xwL_FMR3vboSo"/>[original file](https://www.websequencediagrams.com/?lz=dGl0bGUgVXBkYXRlIEZpbGUgTWV0YWRhdGEKCnBhcnRpY2lwYW50IENsaWVudCBhcyBjAAUFABANUGlhenphIGFzIHAABQUALQ0AUAVCdWNrZQA6BWZiCgoAPQYtPisAKQY6AGoWAEYGLT5mYjoAgRkHAAsQLT4-LQCBCQYAOgkAgTYIIHJlc3VsdHMKCg&s=magazine&h=4NI09Ift5nkg6teC)

#### Information Exchange: Update Metadata
###### Request
* File (PUT)

###### Response N/A

###### Security
The request requires authentication and authorization 
with the owner of the file bucket (e.g., Piazza).

### Metadata Injection
<img src="http://www.websequencediagrams.com/files/render?link=c0gl1Avulh5x2w7lGxlk"/>[original file](https://www.websequencediagrams.com/?lz=dGl0bGUgTWV0YWRhdGEgSW5qZWN0aW9uCgpwYXJ0aWNpcGFudCBiZi1oYW5kbGUgYXMgYnJva2VyABMNUGlhenphIGFzIHAABQUAMA1GaWxlIEJ1Y2tldCBhcyBmYgBODVRpZGUgUHJlZGkAcwUgU2VydmljAGQFdHBzCgphdXRvbnVtYmVyIDEKCgB2Bi0-AGEGOiBHZXQgRGV0ZWN0ZWQgU2hvcmVsaW5lcwoAgQEGLT5mYgAeBkZpbGUKZmIALwoADAUAHggAgUwGOgA1FWxvb3AgZm9yIGVhY2ggZmVhdHVyZQogAIF_BwAyCkNvbGxlY3QgQ2VudHJvaWQKZW5kAIEmCnRwcwCBJwZUaWRlcwp0cHMAbAoADQYAgVIJAIEFCFVwZGF0AIMRCgoKcmVmIG92ZXIAgnoHLACCZAcgIEluZ2VzdAAqB2QAgWYGICBTZWU6ABMIAAwHAIM8C2N0cyBhcyBDbGllbnQKZW5kIHJlZgoK&s=magazine&h=36UnIYFR8zbULJGC)

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
<img src="http://www.websequencediagrams.com/files/render?link=zcB_Y1rADqVSojC3DmXB"/>[original file](https://www.websequencediagrams.com/?lz=dGl0bGUgRGVwbG95IEZpbGUKCnBhcnRpY2lwYW50IENsaWVudCBhcyBjAAUFABANUGlhenphIGFzIHAABQUALQ1XZWIgRmVhdHVyZSBTZXJ2ZXIgYXMgd2ZzCgoARQYtPisAMQY6AHINAEUGLT53ZnMABBUtPj4tAIEGBjoAgSsFAIE1B21lbnQgcmVzdWx0cwoK&s=magazine&h=iF7Iatn5TDSdzjso)

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
<img src="http://www.websequencediagrams.com/files/render?link=cz5Ci8sds4AnusoP-vna"/> [original file](https://www.websequencediagrams.com/?lz=dGl0bGUgRGlzcGxheSBEZXRlY3RlZCBTaG9yZWxpbmVzCgphdXRvbnVtYmVyIDEKCnBhcnRpY2lwYW50IEFuYWx5c3QgYXMgYQAFBgASDVBpYXp6YSBhcyBwAAUFAC8NRmlsZSBCdWNrZQA7BWZiCgoAPQctPgApBjogR2V0AH4VAEkGLT5mYjoAQgZSZXF1ZXN0CmZiADMKRmlsZQAhCQCBGAc6AIFLFwBxCAAdCgCCCgdkAIIJCHMAggcK&s=magazine&h=-9OKu9B8mqkPXjb2)

#### Information Exchange: Get Map
###### Request
- GetMap request

###### Response
- Map image

#### Function: Display Map

#### Information Exchange: Get File [see above](#get-file)
The requested file is the Detected Shorelines
