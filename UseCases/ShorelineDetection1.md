# Shoreline Detection MVP1
- This is a simple workflow showing the ability to submit an image to Piazza and get back a set of candidate shorelines.
- Detection algorithms themselves are independent of this workflow. They can be changed or updated at will as they become available.

## Data Models
### Detection Inputs
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

## Concept of Operations
### High Level
<img src="http://www.websequencediagrams.com/files/render?link=LhPYRz-eoRRS6HKebjAy"/>
[original file](https://www.websequencediagrams.com/?lz=dGl0bGUgRGV0ZWN0IFNob3JlbGluZSAxCgphdXRvbnVtYmVyIDEKCnBhcnRpY2lwYW50IEFuYWx5c3QABw1QaWF6emEKCk5vdGUgb3ZlcgAeCCwAFAc6IAogIFByZWNvbmRpdGlvbnM6IFNlcnZpY2UgcmVnaXN0cmF0aW9uCmVuZCBub3RlCgoAYQctPgBqBzogU2VsZWN0IGltYWdlIHRvIGFuYWx5egAfDHJlZgB5BgBuCACBSxBzCiAgU2UAgWEScwB0BXJlZi0tPgBnCnByb3Bvc2VkIHMANgoAgQUTUmV2aWV3ABkV&s=magazine&h=8DBkhQ_DauiElTPS)

#### Preconditions
These activities are out of scope for this use case, but required for it to be successful.

##### Cloud Deployment
- [x] pzsvc-exec
- [x] Detection algorithm
- [x] Input images

##### Service Registration
- [x] pzsvc-exec

#### Function: Select Input Parameters
[Detection Inputs](#detection-inputs)

#### Ingest File - [see below](#ingest-file)

#### Shoreline Detection Passthrough - [see below](#shoreline-detection-passthrough)

#### Display Detected Shorelines - [see below](#display-detected-shorelines)

### Ingest File
<img src="http://www.websequencediagrams.com/files/render?link=CN9dbaVTIhMTLUbLOjr5"/> [original file](https://www.websequencediagrams.com/?lz=dGl0bGUgSW5nZXN0IEZpbGUKCnBhcnRpY2lwYW50IEFuYWx5c3QgYXMgYQAFBgASDVBpYXp6YQAlDUZpbGUgQnVja2UAMQVmYgoKADMHLT4AKQY6AGINAD0GLS0-PgBaBzogQWNrbm93bGVkZ2VtZW50ABsIPmZiOlN0b3JlAIEhBwAPCABOCFVwZGF0ZSBTdGF0dXMKCmxvb3AgUmVjdXJyaW5nCiAAgTkIAH0KR2V0ACYIICBhbHQgT3BlcmF0aW9uIEluY29tcGxldGUKICAgAIFhBy0AgRkKAC4JZWxzZQAtC0MAGR1Mb2MAWQZvZgCCbAdlZACCbwYgIGVuZAplbmQK&s=magazine&h=bAyVF-Q3ejWfLb46)

#### Information Exchange: Ingest File 
###### Request
* File (POST) -OR-
* File URL

###### Response
Acknowledgement

#### Function: Inspect Acknowledgement
The acknowledgement will provide either an error message or a job ID that can be used to monitor status.

#### Information Exchange: Store File 
###### Request
* File (POST) -OR-
* File URL

###### Response N/A

#### Function: Update Status

#### Information Exchange: Get Status 
###### Request
- Job ID

###### Response
- Job Status
- If Complete
  - Location of Ingested File

### Shoreline Detection Passthrough
<img src="http://www.websequencediagrams.com/files/render?link=Yc5E25woSGfrm-8AzFgE"/> [original file](https://www.websequencediagrams.com/?lz=dGl0bGUgU2hvcmVsaW5lIERldGVjdGlvbiBQYXNzdGhyb3VnaAoKYXV0b251bWJlciAxCgpwYXJ0aWNpcGFudCBBbmFseXN0IGFzIGEABQYAEg1QaWF6emEgYXMgcAAFBQAvDUZpbGUgQnVja2UAOwVmYgoKAD0HLT5yZWYgb3ZlcgAxBywgZmI6AIEXBwCBJQpzCiAgU2UAgSoMRXhlY3V0aW9uCiAAcwljdHMgYXMgQ2xpZW50CmVuZCByZWYKCgCBCwYtPgCBEwY6IFVwZGF0ZSBTdGF0dXMKCmxvb3AgUmVjdXJyaW5nCiAAgVcIACcKR2V0ACYIICBhbHQgT3BlcmEAgjgFSW5jb21wbGV0ZQogICAAgXUHLS0-PgCCHQc6AC8KZWxzZQAvC0MAGR9Mb2MAXQZvZlxuAIMoBmVkAIIEDmVuZAplbmQK&s=magazine&h=H7kEmTJ7i7SKowA7)

#### Information Exchange: Get Detected Shorelines
###### Request (Analyst)
- [Detection Inputs](#detection-inputs)

###### Response 
- Acknowledgement

#### Function: Inspect Acknowledgement
The acknowledgement will provide either an error message or a job ID that can be used to monitor status.

#### Detection Execution: [see below](#detection-execution)

#### Function: Update Status

#### Information Exchange: Get Status 
###### Request
- Job ID

###### Response
- Job Status
- If Complete
  - Location of detected shorelines

### Detection Execution
<img src="http://www.websequencediagrams.com/files/render?link=Klw1cF-FDHcXUVajNkBK"/>
[original file](https://www.websequencediagrams.com/?lz=dGl0bGUgU2hvcmVsaW5lIERldGVjdGlvbiBFeGVjdXRpb24KCnBhcnRpY2lwYW50IFBpYXp6YQAGDXB6c3ZjLWJmIGFzAAYGACQNSW1hZ2UgQXJjaGl2ZSBhcyBpYQphdXRvbnVtYmVyIDEKCgBNBi0-AEMFOgB8BwCBCgpzCgBbBgAYCFZhbGlkYXRlIElucHV0CmFsdCB2YWxpZCBpAAsFACYHaWE6IEdlAHgHCmkAVQoACwYARQ4AgWYGZSBBbGdvcml0aG0AawgAgWgGOiBDYW5kAG8GAIEMC2Vsc2UgaW4AahMALwhFcnJvciBtZXNzYWdlCmVuZAo&s=magazine&h=sSp3fkDEI6V1MvLT)

#### Information Exchange: Detect Shorelines
###### Request
- [Detection Inputs](#detection-inputs)

###### Response
Note: the connection stays open until the operation completes.
- An appropriate error -OR-
- Process outputs
  - Location of Detected Shorelines

#### Information Exchange: Get Image
###### Request
Image URL
###### Response
Image file

#### Information Exchange: Execute Algorithm
###### Request (EXECUTE)
- [Detection Inputs](#detection-inputs)

###### Response
- [Detected Shorelines](#detected-shorelines) (GeoJSON)
The executable may output its response in the file provided

#### Function: Algorithm Execution

#### Information Exchange: Store Detected Shorelines
###### Request
- [Detected Shorelines](#detected-shorelines) (GeoJSON)

###### Response N/A

#### Function: Cleanup
Cleanup activities like the following may be performed.
- Delete input file
- Delete output file

### Display Detected Shorelines
<img src="http://www.websequencediagrams.com/files/render?link=cz5Ci8sds4AnusoP-vna"/> [original file](https://www.websequencediagrams.com/?lz=dGl0bGUgRGlzcGxheSBEZXRlY3RlZCBTaG9yZWxpbmVzCgphdXRvbnVtYmVyIDEKCnBhcnRpY2lwYW50IEFuYWx5c3QgYXMgYQAFBgASDVBpYXp6YSBhcyBwAAUFAC8NRmlsZSBCdWNrZQA7BWZiCgoAPQctPgApBjogR2V0AH4VAEkGLT5mYjoAQgZSZXF1ZXN0CmZiADMKRmlsZQAhCQCBGAc6AIFLFwBxCAAdCgCCCgdkAIIJCHMAggcK&s=magazine&h=-9OKu9B8mqkPXjb2)

#### Information Exchange: Get Detected Shorelines
###### Request (Analyst)
- File identifier

###### Response (Piazza)
- [Detected shorelines](#detected-shorelines)

#### Information Exchange: File Request
###### Request (Piazza)
- File identifier

###### Response (File Bucket)
- [Detected shorelines](#detected-shorelines)

#### Function: Display Detected Shorelines

