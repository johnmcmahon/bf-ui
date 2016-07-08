# Shoreline Detection 3
This is an extension of [Use Case 1](ShorelineDetection1.md) that introduces different concepts than [Use Case 2](ShorelineDetection2.md). Use Cases 2 and 3 do not have to be developed sequentially.
- In this workflow the analyst initiates a large number of detection operations in order to establish a baseline of detected shorelines.

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
<img src="http://www.websequencediagrams.com/files/render?link=-LhbydE_w6o3Iq1-ZgjU"/>
[original file](https://www.websequencediagrams.com/?lz=dGl0bGUgRGV0ZWN0IFNob3JlbGluZSAzCgphdXRvbnVtYmVyIDEKCnBhcnRpY2lwYW50IEFuYWx5c3QABw1QaWF6emEKCk5vdGUgb3ZlcgAeCCwAFAc6IAogIFByZWNvbmRpdGlvbnM6IFNlcnZpY2UgcmVnaXN0cmF0aW9uLCBNZXRhZGF0YSBoYXJ2ZXN0aW5nCmVuZCBub3RlCgoAdgctPgCAfwc6IFNlbGVjdCBOb21pbgA-BSBDcml0ZXJpYQAjC3JlZgCBEQYAgQYIRGlzYwCBIwVDYW5kaWRhdGUgSW1hZ2VzCiAgU2VlOgBICAAOCWVuZCByZWYtLT4AcQoAKxEAgRYJLT4AYRJFdmFsdWF0ZQBaGQAYCQCBAQlJbXBsZW1ldGVkIGFzIGEgY29udGludQCBYQYKICBvcACBbAVmb3IAgQslAIFdBSBTY29yZXMKCm9wdCBpZiBuZWVkZWQKIACDUAgtPgCDKghHZXQAhBQHaW9uIEFsZ29yaXRobXMKIACDaQcAggANABUVZW5kIACDGhtJbnB1dCBQYXJhbWV0ZXIAgjYLAIMfEwCFFg8AgyEJAIEZCkV4ZWN1dGlvbgCDGRVBY2tub3dsZWRnZW1lbnQAhDgUSW5zcGVjdAAZEmxvb3AgUmVjdXJyaW5nAIIVGFN0YXR1cwogIGFsdCBPcGUAhU0GIENvbXBsZXRlCiAgAIIxCQCFNgpQcm9wb3NlZACBTA5lbHNlIEluYwAeHQBnCWVuZAplbmQAhgsUUmV2aWV3IHAAXghzAII2Cg&s=magazine&h=FrKp-Bns1g6AwEGs)

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

#### Information Exchange: Get Baseline Shorelines
###### Request
- WFS Request

###### Response
- Shoreline Features (WFS - GeoJSON)

#### Function: Crawl along baseline shorelines

#### Information Exchange: Get Baseline Shorelines
###### Request
- Bounding box
- Maximum date of collection

###### Response
- Image Metadata (JSON)

#### Function: Evaluate Images

#### Shoreline Detection Brokering: [see below](#shoreline-detection-brokering)

#### Information Exchange: Persist Processing Results
The point here is that there should probably be some link between the shoreline features and at least the footprints of the images. This will allow the agent to determine whether full coverage was reached. 
###### Request: TBD
###### Response: TBD

#### Information Exchange: Conflate Detected Shorelines
###### Request: TBD
###### Response: TBD

#### Function: Conflation
The shoreline features need to be conflated into a single set of feature objects.

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

#### Function: Test Image
If sub-indexes exist, each image needs to tested against the filter criteria (features)

#### Function: Add to Sub-Index
Add the image to the designated sub-index.

### Shoreline Detection Brokering
<img src="http://www.websequencediagrams.com/files/render?link=1wgcwbcPpI4Xwc_DUWC5"/> [original file](https://www.websequencediagrams.com/?lz=dGl0bGUgU2hvcmVsaW5lIERldGVjdGlvbiBCcm9rZXJpbmcKCnBhcnRpY2lwYW50IEFuYWx5c3QgYXMgYQAFBgASDVBpYXp6YSBhcyBwAAUFAC8NcHpzdmMtYmYtYgBXBSBhcyAABAYAExNleGVjAEIFenN2YwB1DUZpbGUgQnVja2UAgQEFZmIKYXV0b251bWJlciAxCgoAgRAHLT4AfAY6AIFNBwCBWwpzCgCBFgYtLT4-AIE9BzogQWNrbm93bGVkZ2VtZW50ADwKABkJSW5zcGVjdFxuYQAcDwBHBz4AgVAGAFwUAIFqBgAYClZhbGlkYXRlIElucHV0ABYJZmI6IFF1ZXJ5IGZvcgCDBAdlZACBLQxmYi0tPgBgCVByZXNlbmNlIG9mABkVCmFsdCBpbnZhbGlkIGkAZgUgAIJrBy0tPgCCFwlFcnJvciBtZXNzYWdlCmVsc2UgYWxyZWFkeSBjb2xsAIEABQAkFUxvY2EAhCcFb2ZcbgCBGxQARwUAcQ5yZWYgb3ZlcgCDcwcsAIQPBiwgZmIKICAgIFNlZToAhHoVRXhlY3V0aW9uACIFAIUXBiBhY3RzIGFzIENsaWVudAogIGVuZCByZWYAdzduZAoAg0QJAIQ1CFVwAIMkBVN0YXR1cwoKbG9vcCBSZWN1cgCGFgUgAIV9CACEZApHZXQAJgggIGFsdCBPcGVyAIIhBkluY29tcGxldGUAgWcFAIRzEwAwCQCDAQUAMApDABkfAIJpIQCCFgUAgVwGCgo&s=magazine&h=VAFSQ0cxEa7H2Pb_)

#### Information Exchange: Detect Shorelines (Analyst)
###### Request
- [Detection Inputs](#detection-inputs)

###### Response
- Acknowledgement

#### Function: Inspect Acknowledgement
The acknowledgement will provide either an error message or a job ID that can be used to monitor status.

#### Information Exchange: Detect Shorelines (Piazza)
###### Request (POST)
- [Detection Inputs](#detection-inputs)

###### Response
Note: the connection stays open until the operation completes.
- An appropriate error -OR-
- Process outputs
  - Location of detected shorelines
  
#### Function: Validate Input
This includes determining where the output will be stored

#### Information Exchange: Query for Detected Shorelines
###### Request
- File identifier

###### Response
- Presence of previous detection

#### Shoreline Detection Execution - [see below](#shoreline-detection-execution)

#### Natural Color Image Creation - [see below](#natural-color-image-creation)

#### Information Exchange: Get Detected Shorelines
###### Request
- File Request (File ID)
- File Metadata Request (File ID)

###### Response
- [Detected Shorelines](#detected-shorelines) (GeoJSON)
- [File Bucket Metadata](#file-bucket-metadata)

#### Information Exchange: Update File Bucket Metadata
###### Request
- [File Bucket Metadata](#file-bucket-metadata)

###### Response N/A

#### Function: Metadata Injection

#### Information Exchange: Store Updated Shorelines
###### Request
- [Detected Shorelines](#detected-shorelines) (GeoJSON)
- [File Bucket Metadata](#file-bucket-metadata)

###### Response N/A

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

#### Information Exchange: Get Images
###### Request
Image URL IDs
###### Response
Image files (TIFF)

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

### Natural Color Image Creation
<img src="http://www.websequencediagrams.com/files/render?link=_VcVLUP4dl8MGi2T1zk6"/> [original file](https://www.websequencediagrams.com/?lz=dGl0bGUgTmF0dXJhbCBDb2xvciBJbWFnZSBDcmVhdGlvbgoKYXV0b251bWJlciAxCgpwYXJ0aWNpcGFudAAjB0FyY2hpdmUgYXMgaWEAEw1iZi1oYW5kbAAXBWNsaWVudAAzDVBpYXp6ACUOAHcGVG9vbABLBXQKCmFsdCBpAIEOBWFscmVhZHkgZXhpc3RzCiAATActPmlhOiBHZXQAgTQMCiAgaWEtPgBvBjoACw8AMAgAegY6IEluZ2VzAC8QAIEXBi0tPgAxFCBPYmplY3QgSUQKZWxzZQCBGgdtdXN0IGJlIGNyZWF0ZWQAgQ8TAIJWBkJhbmRzAIETDwCCcQUAgUkMAIEODwAsDgCBCxJCYW5kAIEMCgCCEwstPj5pdDogRXhlY3V0ZQCDThAgIGkAgX4LAIEREgCBfwcAPgUAgS4PdAAQBgCEJAUAUQcAQA8AgjkfADkFAII_FQCBEQUAglgibmQKAIM7EFNlcnYAgV0IaW4gR2VvAA0FcgoAgUEIABYTABQIAINgC01hcABGBWljZSBFbmRwb2ludAoK&s=magazine&h=kfp6SALOkj-8Uw--)

#### Information Exchange: Get Color Image
###### Request
- Image URI

###### Response
- Color Image (TIFF) -or-
- Not Found message

#### Information Exchange: Ingest Color Image
###### Request (bf-handle or pzsvc-exec)
- Color Image (TIFF)

###### Response
- Color Image Object ID

#### Information Exchange: Get Image Bands
###### Request (bf-handle)
- Image URIs

###### Response (Image Archive)
- Images (TIFF)

#### Information Exchange: Ingest Image Bands
###### Request
- Image Bands (TIFF)

###### Response
- Images Band Object IDs

#### Information Exchange: Execute Image Creation
###### Request
- Image Band Object IDs

###### Response
- Color Image Object ID

#### Information Exchange: Get Image Bands
###### Request (pzsvc-exec)
- Image Band Object IDs

###### Response (Piazza)
- Images (TIFF)

#### Function: Create Color Image
- Band merging
- Color correction

#### Information Exchange: Serve Image in Map Server
###### Request
- Color Image Object ID

###### Response
- Map Service Endpoint

#### Function: Serve Image

