# Shoreline Detection 4
This is an extension of [Use Case 3](ShorelineDetection3.md).
- In this workflow the analyst establishes a standing query to initiate shoreline detection whenever relevant images are added to the Image Archive.
- The Image Archive sends an event to Piazza reporting the presence of a new image.
- The Piazza Workflow Manager inspects the image metadata (calling the Evaluation Service), and if it is conformant, it initiates a detection operation and stores the results for future use.
- The analyst receives feedback on the operation through a dashboard.

## Data Models
### Detection Image Criteria
- Date of Collection (ISO-8601)
- Bounding Box (GeoJSON BBox)
- Area of Interest (GeoJSON Polygon Geometry)
- Percentage of cloud cover (maximum)
- File format
- Bit depth
- Resolution (ground sample distance)
- Bands (string array)
- File size (maximum)

### Image Descriptors
- ID
- URI (path)
- Small Thumbnail URI
- Large Thumbnail URI
- Metadata
  - Based on [Detection Image Criteria](#detection-image-criteria)
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

### File Bucket Metadata
- algorithm execution details
- date of collection
- sensor name
- image ID

## Concept of Operations
### High Level
<img src="http://www.websequencediagrams.com/files/render?link=UJEyeztRNdJJQJW0_Mox"/>
[original file](https://www.websequencediagrams.com/?lz=dGl0bGUgRGV0ZWN0IFNob3JlbGluZSA0CgphdXRvbnVtYmVyIDEKCnBhcnRpY2lwYW50IGJmLXVpIGFzIEFuYWx5c3QAEA1QaWF6emEAIw1JbWFnZSBDYXRhbG9nIGFzIGlhCgpOb3RlIG92ZXIAPggsADQHLCBpYTogCiAgUHJlY29uZGl0aW9uczogQ2xvdWQgZGVwbG95bWVudCwgU2VydmljZSByZWdpc3RyYXRpb24sIElDIExpc3RlbmVyCmVuZCBub3RlCgpyZWYAVRkKICBTZWU6IEhhcnZlcwCBKAhNZXRhZGF0YQBABXJlZgoKb3B0IGlmIG5lZWRlZAogAIF3CC0-AIFuBjogR2V0AIJEB2lvbiBBbGdvcml0aG1zCiAAghAHLS0-PgCCLgc6ABQWZW5kIAoKAEkRUG9zdCBUcmlnZ2VyCgA5E0Fja25vd2xlZGdlbWVudAoKaWEtPmlhOiBSZWNlaXZlIG5ldyBpAIMDBW0AgVAIaWEAgTAKTmV3AIMgB0V2ZW50AFsIAIFRCQCEGgdzdGFuZGluZyBxdWVyeSBtYXRjaACCUQsAg3UHAIJIB1Byb2Nlc3MgSW5jb21pbmcAhAIGAIJGCQBTEFBlcnNpc3QgcAAxBmluZyByZXN1bHRzCgpsb29wIFJlY3VycmluZwCCYhlhc2hib2FyZACCZgoAgjYLcHVsYXRlABEUAIMIDQA7CQCCcxcAg1oKZWQAhicKcwCDARQAExQAhHAaAIR-CFJldmlldwBPFQCFAgg&s=magazine&h=o_ZQXkQQQghTA-jY)

#### Preconditions
These activities are out of scope for this use case, but required for it to be successful.

##### Cloud Deployment
- [ ] service reporting the available detection algorithms
- [ ] pzsvc-nominator
- [ ] pzsvc-bf-eval
- [ ] pzsvc-exec
- [ ] detection algorithms

##### Service Registration
- [ ] service reporting the available detection algorithms
- [ ] pzsvc-nominator
- [ ] pzsvc-bf-eval
- [ ] pzsvc-exec

#### Harvest Image Metadata: [see below](#harvest-image-metadata) 

#### Information Exchange: Get Detection Algorithms
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

#### Information Exchange: Post Trigger
###### Request: POST pz-gateway.../trigger
- Condition
   - Event Type ID
- Job
   - Job Type

###### Response
- Acknowledgement

#### Function: Receive New Image
Out of scope of this use case.

#### Information Exchange: New Image Event
###### Request
- [Image Descriptor](#image-descriptors) 

###### Response N/A

#### Function: Detect Trigger Match

#### Function: Process Incoming Image - [See below](#process-incoming-image)

#### Function: Persist Processing Results
TBD

#### Information Exchange: Get Dashboard
###### Request
TBD

###### Response
Among other things...
- [Detected Shorelines - properties](#detected-shorelines)

#### Function: [Review Detected Shorelines](../Analyst/ReviewProposedShorelines.md)

### Harvest Image Metadata
<img src="http://www.websequencediagrams.com/files/render?link=H4oWXErbvC8ZjH798BDi"/> [original file](https://www.websequencediagrams.com/?lz=dGl0bGUgSGFydmVzdCBJbWFnZSBNZXRhZGF0YQoKcGFydGljaXBhbnQgYmYtdWkABQ0AKAZDYXRhbG9nIGFzIGljACUNUGlhenphIGFzIHAABQUAKhNBcmNoaXZlADgFYQphdXRvbnVtYmVyIDEKCgBsBS0-aWM6AIEXCWV4aXN0aW5nIG0AgRsIaWMtPgCBFQU6IEFja25vd2xlZGdlbWVudAAWBQBzBjogR2V0IGV2ZW50IHR5cGUgaWQKAIENBi0tPgBcBUUAEgpJRApvcHQgaWYgbmVlZGVkCiAgAD4MUmVnaXN0ZXIARAsKZW5kCnJlZiBvdmVyIGljLCBpYQogIFNlZToAgkMPAIJhCGluZyBMb29wCmVuZCByZWYAYREAgXELRXN0YWJsaXNoIHJlY3VycmluZyBoAIMqBgogIABlEgBTJiAgAHMIZW5kCgo&s=magazine&h=7kBiS47sCgtqJvlC)

#### Information Exchange: Harvest Existing Metadata
###### Request
- API key for Image Archive (if needed)

###### Response
- Acknowledgement

#### Authenticate
###### Request: GET pz-gateway.../
- Credentials

###### Response
- Acknowledgement -or-
- Error message

#### Information Exchange: Get Event Type ID
###### Request: GET pz-gateway.../eventType
###### Response
- Name
- ID

#### Information Exchange: Register Event Type
If the event type has not been registered yet, 
it must be registered now to support subsequent operations.
###### Request: PUT pz-gateway.../eventType
- Name
- Schema

#### Image Metadata Harvesting Loop: [see below](#image-metadata-harvesting-loop)

#### Information Exchange: Establish Recurring Harvest
###### Request


### Image Metadata Harvesting Loop
<img src="http://www.websequencediagrams.com/files/render?link=SbbUAEoyFBpmMLmwXf7J"/> [original file](https://www.websequencediagrams.com/?lz=dGl0bGUgSW1hZ2UgTWV0YWRhdGEgSGFydmVzdGluZyBMb29wCgpwYXJ0aWNpcGFudAAlB0NhdGFsb2cgYXMgaWMADRNBcmNoaXZlABsFYQAzDVBpYXp6YSBhcyBwAAUFCgphdXRvbnVtYmVyIDEKCmxvb3AgV2hpbGUgbmV3IGltYWdlcyByZW1haW4KICBpYy0-aWE6IFF1ZXJ5IGZvcgAcBiBtAIE2BwogIGlhLT5pYzoAgU8HAA0MYwATBlByb2Nlc3MgaW5jb21pbmcAXgcKICBvcHQgaWYgbmVlZGVkCiAgAGoGAIEjBjogUG9zdACBEAVldmVudAogIGVuZAplbmQKCg&s=magazine&h=KPnRD8l2gfwnA_Q_)

#### Information Exchange: Query for Image Metadata
###### Request
- Image Archive-specific

###### Response
- Image Archive-specific
   - [image descriptors](#image-descriptors)

#### Function: Process Incoming Images
Add the image to the main index.

#### Information Exchange: Post New Event
###### Request
- Image ID
- Event Name

###### Response: N/A

#### Function: Test Image
If sub-indexes exist, each image needs to tested against the filter criteria (features)

#### Function: Add to Sub-Index
Add the image to the designated sub-index.

### Process Incoming Image
<img src="http://www.websequencediagrams.com/files/render?link=ySQrO8WN6BUfEouHN4xr"/> [original file](https://www.websequencediagrams.com/?lz=dGl0bGUgUHJvY2VzcyBJbmNvbWluZyBJbWFnZQoKcGFydGljaXBhbnQgUGlhenphAAYNcHpzdmMtYmYtYnJva2VyIGFzAA0GACsNAEYFIEFyY2hpdmUgYXMgaQA3DkZlYXR1cmUgUmVwb3NpdG9yeSBhcyBmcgoKYXV0b251bWJlciAxCgoAegYgLT4AcQY6AIEdGHJlZiBvdmVyAIEEByAgU2VlOiBFdmFsdWF0ZQCBVAZzCiAAgSsSY3RzIGFzIENsaWVudAplbmQgcmVmCgpvcACBPAhjb25mb3JtcwogIABXDiwgaWEKICAgIERldGVjdCBTaG9yZWxpbgBjBQB6BwAVBmlvbiBFeGVjdXRpb24KICAAXQkAgQgIPmZyAIFVBXBvc2VkADsOZnIAGAZTdG9yZQCCLwgAEgctPj4Agg8HABAIJyBMb2NhAGAHAIMjBi0-PgCDPwYATRUgCiAAg10HLQAdCmVyc2lzAIFEDWVuZAo&s=magazine&h=YtrgzBeRuU0H9Khl)

#### Information Exchange: Process Incoming Image
###### Request
- [Image Descriptor](#image-descriptors) 

###### Response
- Acknowledgement

#### Function: Evaluate Images - [see below](#evaluate-images)
#### Function: Assess Evaluations
Here we are determining whether the image is suitable for shoreline detection. Details TBD.
#### Information Exchange: Detection Report
###### Request (POST)
- Status: complete
- [Detected shorelines](#detected-shorelines)

###### Response N/A

### Evaluate Images
<img src="http://www.websequencediagrams.com/files/render?link=RKFILTktpWHhaKwZnsII"/> [original file](https://www.websequencediagrams.com/?lz=dGl0bGUgRXZhbHVhdGUgSW1hZ2VzCgpwYXJ0aWNpcGFudCBQaWF6emEABg1wenN2Yy1iZi1ldmFsIGFzAAsGCgoAJQYtPgAbBToASAYgRGVzY3JpcHRvcnMKbG9vcCBlYWNoIGltYWdlCiAARAcAJA4AgQgHaW9uCmVuZAoAHAcAgQIGOiBVcGRhdGVkAEsT&s=magazine&h=vUmYQvEGSX59HFGW)

#### Information Exchange: Evaluate Image
###### Request
- [Image Descriptor](#image-descriptors) 

###### Response
- [Image Descriptor](#image-descriptors) including Beachfront Evaluation Score

#### Function: Image Evaluation
It is a too early to tell what criteria will be used to score these images but cloud cover and image resolution are obvious ones.
Some testing will need to be performed to determine what makes a good candidate image. 
It is possible that this operation will have to reach back to the Image Catalog or even the Image Archive.

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
- Store key with job information
