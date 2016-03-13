# Shoreline Detection 2

## Concept of Operations
### High Level
<img src="http://www.websequencediagrams.com/files/render?link=D9axg9OAxnfJh6duGlpZ"/>
[original file](https://www.websequencediagrams.com/?lz=dGl0bGUgRGV0ZWN0IFNob3JlbGluZSAyCgphdXRvbnVtYmVyIDEKCnBhcnRpY2lwYW50IEFuYWx5c3QABw1QaWF6emEKCk5vdGUgb3ZlcgAeCCwAFAc6IAogIFByZWNvbmRpdGlvbnM6IFNlcnZpY2UgcmVnaXN0cmF0aW9uLCBNZXRhZGF0YSBoYXJ2ZXN0aW5nCmVuZCBub3RlCgoAdgctPgCAfwc6IFNlbGVjdCBBT0kAEwtyZWYAgQEGAHYIRGlzYwCBEwVDYW5kaWRhdGUgSW1hZ2VzCiAgU2VlIE5vbWluAAsLZW5kIHJlZi0tPgBgCgAqEQBVG0V2YWx1YXRlAFgYABcJAFUbAIEcBSBTY29yAF8NAIFqEGkAIgV0byBhbmFseXplCgpvcHQgaWYgbmVlZGVkCiAAgyoILT4AgwQIR2V0AINuB2lvbiBBbGdvcml0aG1zCiAAg0MHAIFrDQAVFWVuZCAAglQdAIRFDwCCYQgABhIAglcUQWNrbm93bGVkZ2VtZW50AINkFEluc3AAg3QFABsQbG9vcCBSZWN1cnJpbmcAgWcYU3RhdHVzCiAgYWx0IE9wZQCEeQYgQ29tcGxldGUKICAAggMJAIRiClByb3Bvc2VkAIFJDmVsc2UgSW5jAB4dAGcJZW5kCmVuZACFNxRSZXZpZXcgcABeCHMAgjMK&s=magazine&h=QNPoqJueVeUx70un)

#### Information Exchanges
##### Nominate Images - [see below](#nominate-images)
##### Evaluate Images - [see below](#evaulate-images)
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

##### Detect Shorelines - [see below](#detect-shorelines)
##### Get Status 
###### Request
- Job ID

###### Response
- Job Status
- Candidate Shorelines (GeoJSON) - if operation complete

###### Implementation Considerations
1. Is GeoJSON robust enough for this operation?
1. What properties other than the geometry itself need to be presented in the output?

#### Functional Requirements
##### [Select Nomination Criteria](../Analyst/IdentifyNominationCriteria.md)
##### Select input parameters
1. [Select Image to Analyze](../Analyst/SelectImage.md)
1. [Select Detection Algorithm](../Analyst/DelectDetectionAlgorithm.md)

##### Inspect Acknowledgement
The acknowledgement will provide either an error message or a job ID that can be used to [monitor status](#get-status).

##### [Review Proposed Shorelines](../Analyst/ReviewProposedShorelines.md)

### Nominate Images
<img src="http://www.websequencediagrams.com/files/render?link=V6sq6BnaasTC2GzORrB4"/> [original file](https://www.websequencediagrams.com/?lz=dGl0bGUgTm9taW5hdGUgSW1hZ2VzCgpwYXJ0aWNpcGFudCBQaWF6emEABg1wenN2Yy1uADAGb3IgYXMADQYAKw0ARwUgQ2F0YWxvZyBhcyBpYwoKTm90ZSBvdmVyAFAHLCBpYzoKICBJIHNlZSB0aGlzIGFzIGEgY29udmVuaWVuY2UgQVBJIGZvciBhbgBGDi4KICBUaGUgdGVjaG5vbG9neSBiZWhpbmQgdGhlIGMAcgdpcyBzdWJqZWN0IHRvIGNoYW5nZQogIGFuZCB3ZSBuZWVkIGEgd2F5IHRvIGFic3RyYWN0AIEDBmZvciBjbGllbnQgdXNlLgplbmQgbm90ZQoKAIINBi0-AIIDBToAgjcIaW9uIENyaXRlcmlhCgoAgh4GABsIY29uc3RydWN0IHF1ZXJ5ABYJaWM6IFF1ZXJ5AIIhCAppACsKAII0CFJlc3VsdHMASwkAgwwGOgCCWwdEZXNjcmlwdG9ycwo&s=magazine&h=AbGbJgMOZYAxx57e)

#### Information Exchanges
##### Nominate Images
###### Request
- Image criteria (JSON)
  - Spatial extents (GeoJSON geometry)
  - Temporal extents (ISO-8601?)
  - Other criteria TBD
- Continuation Options (execute Evaluate Images)

###### Response
- Image descriptors (JSON) 
  - ID
  - URI
  - Name
  - Description
  - Thumbnail URI

###### Implementation Considerations
1. If the Image Archive is not controlled by us, 
it may have its own authentication and authorization system. 
If so, it may be necessary to build an additional Piazza service
to handle the credentials.

##### Query Catalog
###### Request
TBD, technology-dependent.

###### Response
TBD

#### Functional Requirements
##### Construct query
TBD, technology-dependent

### Evaluate Images
<img src="http://www.websequencediagrams.com/files/render?link=RKFILTktpWHhaKwZnsII"/> [original file](https://www.websequencediagrams.com/?lz=dGl0bGUgRXZhbHVhdGUgSW1hZ2VzCgpwYXJ0aWNpcGFudCBQaWF6emEABg1wenN2Yy1iZi1ldmFsIGFzAAsGCgoAJQYtPgAbBToASAYgRGVzY3JpcHRvcnMKbG9vcCBlYWNoIGltYWdlCiAARAcAJA4AgQgHaW9uCmVuZAoAHAcAgQIGOiBVcGRhdGVkAEsT&s=magazine&h=vUmYQvEGSX59HFGW)

#### Information Exchanges
##### Evaluate Images
###### Request
- Image descriptors (JSON) 
  - ID
  - URI
  - Name
  - Description
  - Thumbnail URI

###### Response
- Updated Image descriptors (JSON)
  - ID
  - Score

###### Implementation Considerations

#### Functional Requirements
##### Image Evaluation
It is a too early to tell what criteria will be used to score these images.
Some testing will need to be performed. 
It is possible that this operation will have to reach back to the Image Catalog or even the Image Archive.

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
- Job ID
- Proposed shorelines (GeoJSON)

###### Response N/A

#### Functional Requirements
##### Validate Input
##### [Execute Shoreline Detection](../Analyst/ExecuteShorelineDetection.md)

