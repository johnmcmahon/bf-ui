# Shoreline Detection MVP1
- This is a simple workflow showing the ability to submit an image to Piazza and get back a set of candidate shorelines.
- Detection algorithms themselves are independent of this workflow. They can be changed or updated at will as they become available.

## Data Models
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

#### Function: Select input parameters
1. [Select Image to Analyze](../Analyst/SelectImage.md)

#### Information Exchange: Ingest File - [see below](#ingest-file)

#### Information Exchange: Detect Shorelines - [see below](#detection-execution)

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

### Detection Execution
<img src="http://www.websequencediagrams.com/files/render?link=Klw1cF-FDHcXUVajNkBK"/>
[original file](https://www.websequencediagrams.com/?lz=dGl0bGUgU2hvcmVsaW5lIERldGVjdGlvbiBFeGVjdXRpb24KCnBhcnRpY2lwYW50IFBpYXp6YQAGDXB6c3ZjLWJmIGFzAAYGACQNSW1hZ2UgQXJjaGl2ZSBhcyBpYQphdXRvbnVtYmVyIDEKCgBNBi0-AEMFOgB8BwCBCgpzCgBbBgAYCFZhbGlkYXRlIElucHV0CmFsdCB2YWxpZCBpAAsFACYHaWE6IEdlAHgHCmkAVQoACwYARQ4AgWYGZSBBbGdvcml0aG0AawgAgWgGOiBDYW5kAG8GAIEMC2Vsc2UgaW4AahMALwhFcnJvciBtZXNzYWdlCmVuZAo&s=magazine&h=sSp3fkDEI6V1MvLT)

#### Information Exchange: Detect Shorelines (Analyst)
###### Request
- Input Image(s) (URI)
- Algorithm to use
- Other algorithm-specific parameters

###### Response
- Acknowledgement

#### Information Exchange: Detect Shorelines (Piazza)
###### Request (POST)
- Input Image(s) (URI)
- Algorithm to use
- Other algorithm-specific parameters

###### Response
Note: the connection stays open until the operation completes.
- An appropriate error -OR-
- Process outputs
  - [Detected shorelines](#detected-shorelines)

#### Function: Validate Input

#### Information Exchange: Get Image
###### Request
Image URL
###### Response
Image file

#### Information Exchange: [Execute Shoreline Detection](../Analyst/ExecuteShorelineDetection.md)
###### Request (EXECUTE)
- Executable
- Parameters
  - Input file name(s)
  - Output file name (if applicable)
  - Other algorithm-specific parameters

###### Response
The executable may output its response in the file provided

#### Function: Algorithm Execution

#### Function: Cleanup
Cleanup activities like the following may be performed.
- Delete input file
- Delete output file

#### Function: Update Status

#### Information Exchange: Get Status 
###### Request
- Job ID

###### Response
- Job Status
- If Complete
  - [Detected shorelines](#detected-shorelines)


