# Shoreline Detection 3
This is an extension of [Use Case 1](ShorelineDetection1.md) that introduces different concepts than [Use Case 2](ShorelineDetection2.md). Use Cases 2 and 3 do not have to be developed sequentially.
- In this workflow the analyst establishes a standing query to initiate shoreline detection whenever relevant images are added to the Image Archive.
- The Image Archive sends an event to Piazza reporting the presence of a new image.
- The Piazza Workflow Manager inspects the image metadata (calling the Evaluation Service), and if it is conformant, it initiates a detection operation and stores the results for future use.
- The analyst receives feedback on the operation through a dashboard.

## Data Models
### Image Descriptors
- JSON
  - ID
  - URI
  - Name
  - Description
  - Thumbnail URI
  - Beachfront Evaluation Score (if available)

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
<img src="http://www.websequencediagrams.com/files/render?link=-LhbydE_w6o3Iq1-ZgjU"/>
[original file](https://www.websequencediagrams.com/?lz=dGl0bGUgRGV0ZWN0IFNob3JlbGluZSAzCgphdXRvbnVtYmVyIDEKCnBhcnRpY2lwYW50IEFuYWx5c3QABw1QaWF6emEKCk5vdGUgb3ZlcgAeCCwAFAc6IAogIFByZWNvbmRpdGlvbnM6IFNlcnZpY2UgcmVnaXN0cmF0aW9uLCBNZXRhZGF0YSBoYXJ2ZXN0aW5nCmVuZCBub3RlCgoAdgctPgCAfwc6IFNlbGVjdCBOb21pbgA-BSBDcml0ZXJpYQAjC3JlZgCBEQYAgQYIRGlzYwCBIwVDYW5kaWRhdGUgSW1hZ2VzCiAgU2VlOgBICAAOCWVuZCByZWYtLT4AcQoAKxEAgRYJLT4AYRJFdmFsdWF0ZQBaGQAYCQCBAQlJbXBsZW1ldGVkIGFzIGEgY29udGludQCBYQYKICBvcACBbAVmb3IAgQslAIFdBSBTY29yZXMKCm9wdCBpZiBuZWVkZWQKIACDUAgtPgCDKghHZXQAhBQHaW9uIEFsZ29yaXRobXMKIACDaQcAggANABUVZW5kIACDGhtJbnB1dCBQYXJhbWV0ZXIAgjYLAIMfEwCFFg8AgyEJAIEZCkV4ZWN1dGlvbgCDGRVBY2tub3dsZWRnZW1lbnQAhDgUSW5zcGVjdAAZEmxvb3AgUmVjdXJyaW5nAIIVGFN0YXR1cwogIGFsdCBPcGUAhU0GIENvbXBsZXRlCiAgAIIxCQCFNgpQcm9wb3NlZACBTA5lbHNlIEluYwAeHQBnCWVuZAplbmQAhgsUUmV2aWV3IHAAXghzAII2Cg&s=magazine&h=FrKp-Bns1g6AwEGs)

#### Preconditions
These activities are out of scope for this use case, but required for it to be successful.

##### Service Registration
- [ ] service reporting the available detection algorithms
- [ ] pzsvc-bf-eval
- [ ] pzsvc-bf-broker
- [ ] pzsvc-exec

##### Image Archive Listener
- [ ] When a new image is added to the image archive, an event message is automatically sent to Piazza. 

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
1. If the available algorithms are expected to be stable, this operation is unnecessary.
2. If users are constrained from using certain algorithms for some reason, this operation would be helpful.

##### Initiate Standing Query
###### Request
- Image criteria (JSON)
  - Spatial extents (GeoJSON geometry)
  - Temporal extents (ISO-8601?)
  - Other criteria TBD

###### Response
- Acknowledgement
  - Output channel?

##### New Image Event
###### Request
- [Image Descriptor](#image-descriptors) 

###### Response N/A

##### Get Dashboard
###### Request
TBD

###### Response
Among other things...
- [Detected Shorelines - properties](#detected-shorelines)

#### Functional Requirements
##### Receive New Image
Out of scope of this use case.

##### Process Incoming Image - [See below](#process-incoming-image)

##### [Review Detected Shorelines](../Analyst/ReviewProposedShorelines.md)

### Process Incoming Image
<img src="http://www.websequencediagrams.com/files/render?link=ySQrO8WN6BUfEouHN4xr"/> [original file](https://www.websequencediagrams.com/?lz=dGl0bGUgUHJvY2VzcyBJbmNvbWluZyBJbWFnZQoKcGFydGljaXBhbnQgUGlhenphAAYNcHpzdmMtYmYtYnJva2VyIGFzAA0GACsNAEYFIEFyY2hpdmUgYXMgaQA3DkZlYXR1cmUgUmVwb3NpdG9yeSBhcyBmcgoKYXV0b251bWJlciAxCgoAegYgLT4AcQY6AIEdGHJlZiBvdmVyAIEEByAgU2VlOiBFdmFsdWF0ZQCBVAZzCiAAgSsSY3RzIGFzIENsaWVudAplbmQgcmVmCgpvcACBPAhjb25mb3JtcwogIABXDiwgaWEKICAgIERldGVjdCBTaG9yZWxpbgBjBQB6BwAVBmlvbiBFeGVjdXRpb24KICAAXQkAgQgIPmZyAIFVBXBvc2VkADsOZnIAGAZTdG9yZQCCLwgAEgctPj4Agg8HABAIJyBMb2NhAGAHAIMjBi0-PgCDPwYATRUgCiAAg10HLQAdCmVyc2lzAIFEDWVuZAo&s=magazine&h=YtrgzBeRuU0H9Khl)

#### Information Exchanges
##### Process Incoming Image
###### Request
- [Image Descriptor](#image-descriptors) 

###### Response
- Acknowledgement

##### Detection Report
###### Request (POST)
- Status: complete
- [Detected shorelines](#detected-shorelines)

###### Response N/A

#### Functional Requirements
##### Evaluate Images - [see below](#evaluate-images)
##### Assess Evaluations
Here we are deteriming whether the image is suitable for shoreline detection. Details TBD.

### Evaluate Images
<img src="http://www.websequencediagrams.com/files/render?link=RKFILTktpWHhaKwZnsII"/> [original file](https://www.websequencediagrams.com/?lz=dGl0bGUgRXZhbHVhdGUgSW1hZ2VzCgpwYXJ0aWNpcGFudCBQaWF6emEABg1wenN2Yy1iZi1ldmFsIGFzAAsGCgoAJQYtPgAbBToASAYgRGVzY3JpcHRvcnMKbG9vcCBlYWNoIGltYWdlCiAARAcAJA4AgQgHaW9uCmVuZAoAHAcAgQIGOiBVcGRhdGVkAEsT&s=magazine&h=vUmYQvEGSX59HFGW)

#### Information Exchanges
##### Evaluate Image
###### Request
- [Image Descriptor](#image-descriptors) 

###### Response
- [Image Descriptors](#image-descriptors) including Beachfront Evaluation Score

#### Functional Requirements
##### Image Evaluation
It is a too early to tell what criteria will be used to score these images but cloud cover and image resolution are obvious ones.
Some testing will need to be performed to determine what makes a good candidate image. 
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

##### [Execute Shoreline Detection](../Analyst/ExecuteShorelineDetection.md)
###### Request (EXECUTE)
- Executable
- Parameters
  - Input file name
  - Output file name
  - Other parameters TBD

###### Response
The executable will output its response in the file provided

##### Report Detected Shorelines
###### Request (POST)
- URL derived from callback info
- Job ID derived from callback info
- [Detected shorelines](#detected-shorelines)

###### Response N/A

#### Functional Requirements
##### Validate Input
##### Prepare Algorithm Execution
- Store Image Locally
- Establish output file location

##### Cleanup
- Delete input file
- Delete output file

##### Process Results
- Mark job complete
- Store output in key/value store
