# Shoreline Detection 1
- This is a simple workflow showing the ability to submit an image to Piazza and get back a set of candidate shorelines.
- There is an optional step of querying Piazza for which detection algorithms are available.
- Detection algorithms themselves are independent of this workflow. They can be changed or updated at will as they become available.

## Concept of Operations
### High Level
<img src="http://www.websequencediagrams.com/files/render?link=LhPYRz-eoRRS6HKebjAy"/>
[original file](https://www.websequencediagrams.com/?lz=dGl0bGUgRGV0ZWN0IFNob3JlbGluZSAxCgphdXRvbnVtYmVyIDEKCnBhcnRpY2lwYW50IEFuYWx5c3QABw1QaWF6emEKCk5vdGUgb3ZlcgAeCCwAFAc6IAogIFByZWNvbmRpdGlvbnM6IFNlcnZpY2UgcmVnaXN0cmF0aW9uCmVuZCBub3RlCgoAYQctPgBqBzogU2VsZWN0IGltYWdlIHRvIGFuYWx5egAfDHJlZgB5BgBuCACBSxBzCiAgU2UAgWEScwB0BXJlZi0tPgBnCnByb3Bvc2VkIHMANgoAgQUTUmV2aWV3ABkV&s=magazine&h=8DBkhQ_DauiElTPS)

#### Preconditions
##### Service Registration
- pzsvc-bf
- Whatever service reports which detection algorithms are available

#### Information Exchanges
##### Get Detection Algorithms
###### Request
- N/A

###### Response
- Available Algorithms (JSON)
  - ID
  - Name
  - Description

###### Implementation Considerations
1. If the available algorithms are expected to be stable, 
this operation is unnecessary.
2. If users are constrained from using certain algorithms for some reason,
this operation would be helpful.

##### Detect Shorelines - [see below](#detection-execution)
##### Get Status 
###### Request
- Job ID

###### Response
- Job Status
- Candidate Shorelines (GeoJSON)

###### Implementation Considerations
1. Is GeoJSON robust enough for this operation?
1. What properties other than the geometry itself need to be populated?

#### Functional Requirements
##### Select input parameters
1. [Select Image to Analyze](../Analyst/SelectImage.md)
1. [Select Detection Algorithm](../Analyst/SelectDetectionAlgorithm.md)

##### Inspect Acknowledgement
The acknowledgement will provide either an error message or a job ID that can be used to [monitor status](#get-status).

##### [Review Proposed Shorelines](../Analyst/ReviewProposedShorelines.md)

### Detection Execution
<img src="http://www.websequencediagrams.com/files/render?link=Klw1cF-FDHcXUVajNkBK"/>
[original file](https://www.websequencediagrams.com/?lz=dGl0bGUgU2hvcmVsaW5lIERldGVjdGlvbiBFeGVjdXRpb24KCnBhcnRpY2lwYW50IFBpYXp6YQAGDXB6c3ZjLWJmIGFzAAYGACQNSW1hZ2UgQXJjaGl2ZSBhcyBpYQphdXRvbnVtYmVyIDEKCgBNBi0-AEMFOgB8BwCBCgpzCgBbBgAYCFZhbGlkYXRlIElucHV0CmFsdCB2YWxpZCBpAAsFACYHaWE6IEdlAHgHCmkAVQoACwYARQ4AgWYGZSBBbGdvcml0aG0AawgAgWgGOiBDYW5kAG8GAIEMC2Vsc2UgaW4AahMALwhFcnJvciBtZXNzYWdlCmVuZAo&s=magazine&h=sSp3fkDEI6V1MvLT)

#### Information Exchanges
##### Detect Shorelines
###### Request
- Input Image (URI)
- Algorithm(s) to use
- Callback

###### Response
- Acknowledgement -OR-
- An appropriate error 

###### Implementation Considerations
1. If the Image Archive is not controlled by us, 
it may have its own authentication and authorization system. 
If so, it may be necessary to build an additional Piazza service
to handle the credentials.

##### Report Shorelines
###### Request (POST)
- URL derived from callback info
- Job ID derived from callback info
- Proposed shorelines (GeoJSON)

###### Response N/A

#### Functional Requirements
##### Validate Input
##### [Execute Shoreline Detection](../Analyst/ExecuteShorelineDetection.md)

