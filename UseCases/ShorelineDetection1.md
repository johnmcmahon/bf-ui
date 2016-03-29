# Shoreline Detection 1
- This is a simple workflow showing the ability to submit an image to Piazza and get back a set of candidate shorelines.
- Detection algorithms themselves are independent of this workflow. They can be changed or updated at will as they become available.

## Data Models
### Detected Shorelines
GeoJSON Feature Collection
- features
  - geometry
- properties
  - GEOINT_ID (int or string)
  - COLLECTION_PLATFORM (string)
  - DATE_TIME (ISO-8601 string)
  - RESOLUTION (float)
  - CV_ALGORITHM_NAME (string)

## Concept of Operations
### High Level
<img src="http://www.websequencediagrams.com/files/render?link=LhPYRz-eoRRS6HKebjAy"/>
[original file](https://www.websequencediagrams.com/?lz=dGl0bGUgRGV0ZWN0IFNob3JlbGluZSAxCgphdXRvbnVtYmVyIDEKCnBhcnRpY2lwYW50IEFuYWx5c3QABw1QaWF6emEKCk5vdGUgb3ZlcgAeCCwAFAc6IAogIFByZWNvbmRpdGlvbnM6IFNlcnZpY2UgcmVnaXN0cmF0aW9uCmVuZCBub3RlCgoAYQctPgBqBzogU2VsZWN0IGltYWdlIHRvIGFuYWx5egAfDHJlZgB5BgBuCACBSxBzCiAgU2UAgWEScwB0BXJlZi0tPgBnCnByb3Bvc2VkIHMANgoAgQUTUmV2aWV3ABkV&s=magazine&h=8DBkhQ_DauiElTPS)

#### Preconditions
These activities are out of scope for this use case, but required for it to be successful.

##### Service Deployment
- [ ] pzsvc-exec

##### Service Registration
- [ ] pzsvc-exec

#### Function: Select input parameters
1. [Select Image to Analyze](../Analyst/SelectImage.md)

#### Information Exchange: Detect Shorelines - [see below](#detection-execution)

#### Function: Inspect Acknowledgement
The acknowledgement will provide either an error message or a job ID that can be used to [monitor status](#get-status).

#### Information Exchange: Get Status 
###### Request
- Job ID

###### Response
- Job Status
- [Detected shorelines](#detected-shorelines)

#### Function: [Review Detected Shorelines](../Analyst/ReviewProposedShorelines.md)

### Detection Execution
<img src="http://www.websequencediagrams.com/files/render?link=Klw1cF-FDHcXUVajNkBK"/>
[original file](https://www.websequencediagrams.com/?lz=dGl0bGUgU2hvcmVsaW5lIERldGVjdGlvbiBFeGVjdXRpb24KCnBhcnRpY2lwYW50IFBpYXp6YQAGDXB6c3ZjLWJmIGFzAAYGACQNSW1hZ2UgQXJjaGl2ZSBhcyBpYQphdXRvbnVtYmVyIDEKCgBNBi0-AEMFOgB8BwCBCgpzCgBbBgAYCFZhbGlkYXRlIElucHV0CmFsdCB2YWxpZCBpAAsFACYHaWE6IEdlAHgHCmkAVQoACwYARQ4AgWYGZSBBbGdvcml0aG0AawgAgWgGOiBDYW5kAG8GAIEMC2Vsc2UgaW4AahMALwhFcnJvciBtZXNzYWdlCmVuZAo&s=magazine&h=sSp3fkDEI6V1MvLT)

#### Information Exchange: Detect Shorelines
###### Request (POST)
- Input Image(s) (URI)
- Algorithm to use
- Other algorithm-specific parameters

###### Response
Note: the connection stays open until the operation completes.
- An appropriate error -OR-
- Process outputs
  - [Detected shorelines](#detected-shorelines)

###### Implementation Considerations
1. If the Image Archive is not controlled by us, 
it may have its own authentication and authorization system. 
If so, it may be necessary to build an additional Piazza service
to handle the credentials.

#### Function: Validate Input

#### Information Exchange: Get Image
###### Request
Image URL
###### Response
Image file

#### Function: Prepare Algorithm Execution
- Store Image Locally
- Establish output file location

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

#### Function: Process Results
- Mark job complete
- Store output in key/value store
