# Shoreline Detection MVP1
- This is a simple workflow showing the ability to submit a set of images that make up a scene to Beachfront and get back a set of candidate shorelines.
- Detection algorithms themselves are independent of this workflow. They can be changed or updated at will as they become available.

## Data Models
### Detection Inputs
- Beachfront credentials
- Image(s) (Data ID)
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

##### Cloud Deployment
- [x] bf-handle
- [x] pzsvc-exec
- [x] Detection algorithm

#### Function: Select Input Parameters
[Detection Inputs](#detection-inputs)

#### Ingest File - [see below](#ingest-file)

#### Shoreline Detection Execution - [see below](#shoreline-detection-execution)

#### Display Detected Shorelines - [see below](#display-detected-shorelines)

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

#### Information Exchange: Store File 
###### Request
* File (POST) -OR-
* File URL

###### Response N/A

### Shoreline Detection Execution
<img src="http://www.websequencediagrams.com/files/render?link=Klw1cF-FDHcXUVajNkBK"/>
[original file](https://www.websequencediagrams.com/?lz=dGl0bGUgU2hvcmVsaW5lIERldGVjdGlvbiBFeGVjdXRpb24KCnBhcnRpY2lwYW50IFBpYXp6YQAGDXB6c3ZjLWJmIGFzAAYGACQNSW1hZ2UgQXJjaGl2ZSBhcyBpYQphdXRvbnVtYmVyIDEKCgBNBi0-AEMFOgB8BwCBCgpzCgBbBgAYCFZhbGlkYXRlIElucHV0CmFsdCB2YWxpZCBpAAsFACYHaWE6IEdlAHgHCmkAVQoACwYARQ4AgWYGZSBBbGdvcml0aG0AawgAgWgGOiBDYW5kAG8GAIEMC2Vsc2UgaW4AahMALwhFcnJvciBtZXNzYWdlCmVuZAo&s=magazine&h=sSp3fkDEI6V1MvLT)

#### Information Exchange: Detect Shorelines
###### Request
- [Detection Inputs](#detection-inputs)

###### Response (Async)
- An appropriate error -OR-
- File Identifier for Detected Shorelines

#### Information Exchange: Execute
###### Request
- [Detection Inputs](#detection-inputs)

###### Response (Async)
- An appropriate error -OR-
- Process outputs
  - File Identifier for Detected Shorelines

#### Information Exchange: Get File [see below](#get-file)

#### Information Exchange: Execute Algorithm
###### Request (EXECUTE)
- [Detection Inputs](#detection-inputs)

###### Response
- Error message -OR-
- [Detected Shorelines](#detected-shorelines) (GeoJSON)

The executable may output its response in the file provided

#### Function: Algorithm Execution

#### Information Exchange: Store Detected Shorelines [see above](#ingest-file)
- [Detected Shorelines](#detected-shorelines) (GeoJSON)

#### Function: Cleanup
Cleanup activities like the following may be performed.
- Delete input file
- Delete output file

### Get File
<img src="http://www.websequencediagrams.com/files/render?link=jvzUD9TbAYdAbhNeckH7"/>[original file](https://www.websequencediagrams.com/?lz=dGl0bGUgR2V0IEZpbGUKCnBhcnRpY2lwYW50IENsaWVudCBhcyBjAAUFABANSW5nZXN0ZXIgYXMgaQAFBwAxDUZpbGUgU2VydmljZSBhcyBmcwBQDVBpYXp6YSBhcyBwAAUFCgpvcHQgaW1hZ2Ugc3RvcmVkIGluAB8HCiAAewctPgAnBjoAgSgKIAA5By0-AIEfBjoAgUMGZWxzZSBmaWwAQQxpbnRlcm5hbCBzAIEQBgBMC2ZzAEYNZnMALCNleAA2GSsAggoIAIEcDQCCHwgAZQpmAGUKACgKAB0RAEMKU2FuaXRpemUAQBItAIFwDm5kCgo&s=magazine&h=ULJTScp0KAnA_yeC)

#### Information Exchange: Get File (Piazza)
###### Request
- Piazza credentials
- File ID

###### Response
- File

#### Information Exchange: Get File (Internal Service)
###### Request
- Vendor-specific credentials
- File ID

###### Response
- File

#### Information Exchange: Get File (External Service)
###### Request (Async)
- Vendor-specific credentials
- File ID

###### Response
- File

#### Function: Sanitize File
out of scope

### Update File Metadata
<img src="http://www.websequencediagrams.com/files/render?link=o6iD927xwL_FMR3vboSo"/>[original file](https://www.websequencediagrams.com/?lz=dGl0bGUgVXBkYXRlIEZpbGUgTWV0YWRhdGEKCnBhcnRpY2lwYW50IENsaWVudCBhcyBjAAUFABANUGlhenphIGFzIHAABQUALQ0AUAVCdWNrZQA6BWZiCgoAPQYtPisAKQY6AGoWAEYGLT5mYjoAgRkHAAsQLT4-LQCBCQYAOgkAgTYIIHJlc3VsdHMKCg&s=magazine&h=4NI09Ift5nkg6teC)

#### Information Exchange: Ingest File 
###### Request
* File (POST)
* Piazza credentials

###### Response (Async)
- Job Status

#### Information Exchange: Update Metadata
###### Request
* File (POST) -OR-
* File URL

###### Response N/A

### Metadata Injection
<img src="http://www.websequencediagrams.com/files/render?link=c0gl1Avulh5x2w7lGxlk"/>[original file](https://www.websequencediagrams.com/?lz=dGl0bGUgTWV0YWRhdGEgSW5qZWN0aW9uCgpwYXJ0aWNpcGFudCBiZi1oYW5kbGUgYXMgYnJva2VyABMNUGlhenphIGFzIHAABQUAMA1GaWxlIEJ1Y2tldCBhcyBmYgBODVRpZGUgUHJlZGkAcwUgU2VydmljAGQFdHBzCgphdXRvbnVtYmVyIDEKCgB2Bi0-AGEGOiBHZXQgRGV0ZWN0ZWQgU2hvcmVsaW5lcwoAgQEGLT5mYgAeBkZpbGUKZmIALwoADAUAHggAgUwGOgA1FWxvb3AgZm9yIGVhY2ggZmVhdHVyZQogAIF_BwAyCkNvbGxlY3QgQ2VudHJvaWQKZW5kAIEmCnRwcwCBJwZUaWRlcwp0cHMAbAoADQYAgVIJAIEFCFVwZGF0AIMRCgoKcmVmIG92ZXIAgnoHLACCZAcgIEluZ2VzdAAqB2QAgWYGICBTZWU6ABMIAAwHAIM8C2N0cyBhcyBDbGllbnQKZW5kIHJlZgoK&s=magazine&h=36UnIYFR8zbULJGC)

TBD

### Display Detected Shorelines
<img src="http://www.websequencediagrams.com/files/render?link=cz5Ci8sds4AnusoP-vna"/> [original file](https://www.websequencediagrams.com/?lz=dGl0bGUgRGlzcGxheSBEZXRlY3RlZCBTaG9yZWxpbmVzCgphdXRvbnVtYmVyIDEKCnBhcnRpY2lwYW50IEFuYWx5c3QgYXMgYQAFBgASDVBpYXp6YSBhcyBwAAUFAC8NRmlsZSBCdWNrZQA7BWZiCgoAPQctPgApBjogR2V0AH4VAEkGLT5mYjoAQgZSZXF1ZXN0CmZiADMKRmlsZQAhCQCBGAc6AIFLFwBxCAAdCgCCCgdkAIIJCHMAggcK&s=magazine&h=-9OKu9B8mqkPXjb2)

#### Information Exchange: Get Detected Shorelines
###### Request (Analyst)
- File identifier for Detected Shorelines

###### Response (Piazza)
- [Detected shorelines](#detected-shorelines)

#### Information Exchange: File Request
###### Request (Piazza)
- File identifier

###### Response (File Bucket)
- [Detected shorelines](#detected-shorelines)

#### Function: Display Detected Shorelines

