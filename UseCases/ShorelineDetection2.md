# Shoreline Detection Use Case 2
This is an extension of [Use Case 1](ShorelineDetection1.md).
- This workflow introduces an image catalog that contains metadata about available images
- The analyst provides search criteria and a service returns descriptions of images that match
- Those image descriptors are evaluated for fitness based on metadata including cloud cover, date, etc.
- The analyst chooses images and the process proceeds as before
- The analyst has the ability to review the results

## Data Models
### Detection Algorithms
- ID
- Name
- Description
- Input constraints
- Parameters

### SubIndexes
- name
- key (read-only)
- WFS URL
- feature type name

### Scene Criteria
- Date of Collection (ISO-8601)
- Maximum Date of Collection (ISO-8601)
- Bounding Box (GeoJSON BBox)
- Percentage of cloud cover (maximum)
- File format
- Bit depth
- Resolution (ground sample distance)
- Bands (string array)
- File size (maximum)

### Detection Parameters
- Algorithm ID
- Algorithm executable command
   - IDs of input file(s) 
   - Output file(s)
   - Additional parameters

### Scene Descriptor
- ID
- URI (path)
- Small Thumbnail URI
- Large Thumbnail URI
- Metadata
  - Based on [Scene Criteria](#scene-criteria)
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

### Detection Analysis Results
TBD

### File Bucket Metadata
- algorithm execution details
- date of collection
- sensor name
- image ID

## Concept of Operations
### High Level
<img src="http://www.websequencediagrams.com/files/render?link=D9axg9OAxnfJh6duGlpZ"/>
[original file](https://www.websequencediagrams.com/?lz=dGl0bGUgRGV0ZWN0IFNob3JlbGluZSAyCgphdXRvbnVtYmVyIDEKCnBhcnRpY2lwYW50IEFuYWx5c3QABw1QaWF6emEKCk5vdGUgb3ZlcgAeCCwAFAc6IAogIFByZWNvbmRpdGlvbnM6IFNlcnZpY2UgcmVnaXN0cmF0aW9uLCBNZXRhZGF0YSBoYXJ2ZXN0aW5nCmVuZCBub3RlCgoAdgctPgCAfwc6IFNlbGVjdCBBT0kAEwtyZWYAgQEGAHYIRGlzYwCBEwVDYW5kaWRhdGUgSW1hZ2VzCiAgU2VlIE5vbWluAAsLZW5kIHJlZi0tPgBgCgAqEQBVG0V2YWx1YXRlAFgYABcJAFUbAIEcBSBTY29yAF8NAIFqEGkAIgV0byBhbmFseXplCgpvcHQgaWYgbmVlZGVkCiAAgyoILT4AgwQIR2V0AINuB2lvbiBBbGdvcml0aG1zCiAAg0MHAIFrDQAVFWVuZCAAglQdAIRFDwCCYQgABhIAglcUQWNrbm93bGVkZ2VtZW50AINkFEluc3AAg3QFABsQbG9vcCBSZWN1cnJpbmcAgWcYU3RhdHVzCiAgYWx0IE9wZQCEeQYgQ29tcGxldGUKICAAggMJAIRiClByb3Bvc2VkAIFJDmVsc2UgSW5jAB4dAGcJZW5kCmVuZACFNxRSZXZpZXcgcABeCHMAgjMK&s=magazine&h=QNPoqJueVeUx70un)

#### Preconditions
These activities are out of scope for this use case, but required for it to be successful.

##### Cloud Deployment
- [ ] service reporting the available detection algorithms
- [x] pzsvc-image-catalog
- [x] bf-handle
- [x] pzsvc-exec
- [x] detection algorithms

##### Service Registration
- [x] bf-handle
- [x] pzsvc-exec

##### Metadata Harvesting
- [x] One or more image archives must be established. They may be managed inside or outside Piazza. 
- [x] The image catalog must be populated with metadata about available images from each image archive.

#### Information Exchange: Get Detection Algorithms
###### Request
- N/A

###### Response (JSON)
- [Detection Algorithms](#detection-algorithms)

###### Implementation Considerations
1. If the available algorithms are expected to be stable, this operation is unnecessary.
2. If users are constrained from using certain algorithms for some reason, this operation would be helpful.

#### Information Exchange: Get SubIndexes
###### Request: GET `pzsvc-image-catalog.../subIndex`
###### Response
- [SubIndexes](#subindex)

#### Function: Display Discovery Criteria
- [Detection Algorithms](#detection-algorithms)
- [SubIndexes](#subindex)

#### Function: Discover Scenes - [see below](#discover-scenes)

#### Function: Displayed Discovered Scenes
- [Scene Descriptors](#scene-descriptor)

#### Function: Select Input Parameters
- [Detection Parameters](#detection-parameters)

#### Function: Detect Shorelines - [see below](#detect-shorelines)

#### Function: Review Detected Shorelines - [see below](#review-detected-shorelines)

#### Function: Display Detected Shorelines - [see below](#display-detected-shorelines)

### Discover Scenes
<img src="http://www.websequencediagrams.com/files/render?link=vkRjFvkvfOmfdHLonhaF"/> [original file](https://www.websequencediagrams.com/?lz=dGl0bGUgRGlzY292ZXIgSW1hZ2VzCgpwYXJ0aWNpcGFudCBBbmFseXN0IGFzIGEABQYAEg1QaWF6emEgYXMgcAAFBQAvDQBLBSBDYXRhbG9nIGFzIGljAE8NcHpzdmMtYmYtZXZhbAoKYXV0b251bWJlciAxCgoAZwctPgBwBzogU2VsZWN0IHNlYXJjaCBjcml0ZXJpYQAfCgB8BjoAgUYKaQCBSgYAgRQGLS0-AEEKQWNrbm93bGVkZ2VtZW50ABsIPmljOiBTAFoGZm8AOAlpYwBTCgCBTgZNZXRhZGF0YQAwCQB0CFVwZGF0ZSBTdGF0dXMKb3B0IE9wdGlvbmFsCiAAghwHLT4AgWsNOiBFdmFsdWF0ZQCCeAggIGxvb3AgZWFjaACBPQYKICAgAIIfDgAzEQCCZQYAQwdpb24KICBlbmQKACUSAIEbDWQAgxwHRGVzY3JpcHRvcnMAgRsMAIE_FWVuZAoAgRsFUmVjdXJyaW5nCiAAhBMIAIJ6CkdldACBfQggIGFsdCBPcGVyAIEVBSBJbmNvbXBsZXQAgVEHAIJ0BwCDXQoALwhlbHNlAC0LQwAZHQCDCQ8AgXkGZW5kCg&s=magazine&h=qvQ8sbuINNK7POEF)

#### Function: Select Scene Discovery Criteria
- [Scene criteria](#scene-criteria)

#### Information Exchange: Discover Scenes
###### Request (Analyst)
- [scene criteria](#scene-criteria)

###### Response (JSON)
- [Scene Descriptors](#scene-descriptor)

#### Function: Retrieve Scenes
- If caching is requested
  - Search the repository for matching scenes
  - Put matching scenes in the cache
  - Periodically check the cache. If the cache is complete or sufficiently big, return the required results.
  - Cap the cache size at a modest size to keep the memory footprint in check.
- If caching is not requested (not recommended for large result sets as this might be slow)
  - Search the repository for matching scenes
  - Return the results

### Shoreline Detection Brokering
<img src="http://www.websequencediagrams.com/files/render?link=1wgcwbcPpI4Xwc_DUWC5"/> [original file](https://www.websequencediagrams.com/?lz=dGl0bGUgU2hvcmVsaW5lIERldGVjdGlvbiBCcm9rZXJpbmcKCnBhcnRpY2lwYW50IEFuYWx5c3QgYXMgYQAFBgASDVBpYXp6YSBhcyBwAAUFAC8NcHpzdmMtYmYtYgBXBSBhcyAABAYAExNleGVjAEIFenN2YwB1DUZpbGUgQnVja2UAgQEFZmIKYXV0b251bWJlciAxCgoAgRAHLT4AfAY6AIFNBwCBWwpzCgCBFgYtLT4-AIE9BzogQWNrbm93bGVkZ2VtZW50ADwKABkJSW5zcGVjdFxuYQAcDwBHBz4AgVAGAFwUAIFqBgAYClZhbGlkYXRlIElucHV0ABYJZmI6IFF1ZXJ5IGZvcgCDBAdlZACBLQxmYi0tPgBgCVByZXNlbmNlIG9mABkVCmFsdCBpbnZhbGlkIGkAZgUgAIJrBy0tPgCCFwlFcnJvciBtZXNzYWdlCmVsc2UgYWxyZWFkeSBjb2xsAIEABQAkFUxvY2EAhCcFb2ZcbgCBGxQARwUAcQ5yZWYgb3ZlcgCDcwcsAIQPBiwgZmIKICAgIFNlZToAhHoVRXhlY3V0aW9uACIFAIUXBiBhY3RzIGFzIENsaWVudAogIGVuZCByZWYAdzduZAoAg0QJAIQ1CFVwAIMkBVN0YXR1cwoKbG9vcCBSZWN1cgCGFgUgAIV9CACEZApHZXQAJgggIGFsdCBPcGVyAIIhBkluY29tcGxldGUAgWcFAIRzEwAwCQCDAQUAMApDABkfAIJpIQCCFgUAgVwGCgo&s=magazine&h=VAFSQ0cxEa7H2Pb_)

#### Function: Select Detection Parameters
- [Detection Parameters](#detection-parameters)

#### Information Exchange: Detect Shorelines (Client)
###### Request
- [Detection Parameters](#detection-parameters)

###### Response
- Acknowledgement

#### Function: Inspect Acknowledgement
The acknowledgement will contain either an error message or a job ID that can be used to monitor status.

#### Information Exchange: Detect Shorelines (Piazza)
###### Request (POST)
- [Detection Parameters](#detection-parameters)

###### Response
Note: the connection stays open until the operation completes.
- An appropriate error -OR-
- Process outputs
  - Location of detected shorelines
  
#### Function: Prepare Input
* Validate input
* Get scene metadata from image catalog repository
(we do not want the client to pass all metadata to the server 
because we do not want to deal with the risk
of it being incomplete or out of date.
Instead, we pull the metadata directly from the image catalog.)
* Determine where the output will be stored

#### Information Exchange: Query for Detected Shorelines
###### Request
- File identifier

###### Response
- Presence of previous detection

#### Information Exchange: File Metadata Search
###### Request
- File identifier

###### Response
- File metadata (if any)

#### Shoreline Detection Execution - [see below](#shoreline-detection-execution)

#### Natural Color Image Creation - [see below](#natural-color-image-creation)

#### Information Exchange: Update File Bucket Metadata
###### Request
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
- [Detection Parameters](#detection-parameters)

###### Response
Note: the connection stays open until the operation completes.
- An appropriate error -OR-
- Process outputs
  - Location of Detected Shorelines

#### Information Exchange: Get Images
###### Request: band image URLs
###### Response: image files (TIFF)

#### Information Exchange: Execute Algorithm
###### Request (EXECUTE)
- [Detection Parameters](#detection-parameters)

###### Response
- [Detected Shorelines](#detected-shorelines) (GeoJSON)
The executable may output its response in the file provided

#### Function: Algorithm Execution

#### Function: Ingest Detected Shorelines - [see below](#ingest-file)

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

#### Function: Ingest Color Image - [see below](#ingest-file)

#### Information Exchange: Get Band Images
###### Request (bf-handle)
- Band Image URLs

###### Response (Image Archive)
- Band Images (TIFF)

#### Function: Ingest Band Images - [see below](#ingest-file)

#### Information Exchange: Execute Image Creation
###### Request
- Image Band Object IDs

###### Response
- Color Image Object ID

#### Information Exchange: Get Band Images
###### Request (pzsvc-exec)
- Band Image Object IDs

###### Response (Piazza)
- Band Images (TIFF)

#### Function: Create Color Image
- Band merging
- Color correction

#### Information Exchange: Serve Image in Map Server
###### Request
- Color Image Object ID

###### Response
- Map Service Endpoint

#### Function: Serve Image (out of scope)

### Ingest File
<img src="http://www.websequencediagrams.com/files/render?link=CN9dbaVTIhMTLUbLOjr5"/> [original file](https://www.websequencediagrams.com/?lz=dGl0bGUgSW5nZXN0IEZpbGUKCnBhcnRpY2lwYW50IEFuYWx5c3QgYXMgYQAFBgASDVBpYXp6YQAlDUZpbGUgQnVja2UAMQVmYgoKADMHLT4AKQY6AGINAD0GLS0-PgBaBzogQWNrbm93bGVkZ2VtZW50ABsIPmZiOlN0b3JlAIEhBwAPCABOCFVwZGF0ZSBTdGF0dXMKCmxvb3AgUmVjdXJyaW5nCiAAgTkIAH0KR2V0ACYIICBhbHQgT3BlcmF0aW9uIEluY29tcGxldGUKICAgAIFhBy0AgRkKAC4JZWxzZQAtC0MAGR1Mb2MAWQZvZgCCbAdlZACCbwYgIGVuZAplbmQK&s=magazine&h=bAyVF-Q3ejWfLb46)

#### Information Exchange: Ingest File 
###### Request
* File (POST) -OR-
* File URL

###### Response
- Acknowledgement

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

### Metadata Injection
<img src="http://www.websequencediagrams.com/files/render?link=c0gl1Avulh5x2w7lGxlk"/> [original file](https://www.websequencediagrams.com/?lz=dGl0bGUgTWV0YWRhdGEgSW5qZWN0aW9uCgpwYXJ0aWNpcGFudCBiZi1oYW5kbGUgYXMgYnJva2VyABMNUGlhenphIGFzIHAABQUAMA1GaWxlIEJ1Y2tldCBhcyBmYgBODVRpZGUgUHJlZGkAcwUgU2VydmljAGQFdHBzCgphdXRvbnVtYmVyIDEKCgB2Bi0-AGEGOiBHZXQgRGV0ZWN0ZWQgU2hvcmVsaW5lcwoAgQEGLT5mYgAeBkZpbGUKZmIALwoADAUAHggAgUwGOgA1FWxvb3AgZm9yIGVhY2ggZmVhdHVyZQogAIF_BwAyCkNvbGxlY3QgQ2VudHJvaWQKZW5kAIEmCnRwcwCBJwZUaWRlcwp0cHMAbAoADQYAgVIJAIEFCFVwZGF0AIMRCgoKcmVmIG92ZXIAgnoHLACCZAcgIEluZ2VzdAAqB2QAgWYGICBTZWU6ABMIAAwHAIM8C2N0cyBhcyBDbGllbnQKZW5kIHJlZgoK&s=magazine&h=36UnIYFR8zbULJGC)

#### Information Exchange: Get Detected Shorelines
###### Request
- File Request (File ID)
- File Metadata Request (File ID)

###### Response
- [Detected Shorelines](#detected-shorelines) (GeoJSON)
- [File Bucket Metadata](#file-bucket-metadata)

#### Information Exchange: Get File
###### Request (out of scope)
###### Response
- [Detected Shorelines](#detected-shorelines) (GeoJSON)
- [File Bucket Metadata](#file-bucket-metadata)

#### Function: Collect Centroid
We need a point to run tide prediction on for each detected shoreline feature.
While some of the features may be rather large, 
there still should not be a significant amount of tide variation.

#### Information Exchange: Get Tides
###### Request
- Points (lon, lat)

###### Response
- Tides
  - Point (lon, lat)
  - 24h Max tide
  - 24h Min tide
  - actual tide

#### Function: Update Metadata
Incorporate all available metadata into the shorelines file

#### Function: Ingest Updated Shorelines ([see below](#ingest-file)

### Detection Review
<img src="http://www.websequencediagrams.com/files/render?link=6JY0mf7cgq0XMgi0m96i"/>
[original file](https://www.websequencediagrams.com/?lz=dGl0bGUgUmV2aWV3IERldGVjdGlvbgoKYXV0b251bWJlciAxCgpwYXJ0aWNpcGFudCBBbmFseXN0AAcNUGlhenphABoNRmVhdHVyZSBSZXBvc2l0b3J5IGFzIGZyAD8NYmYtYW5hbHl6ZQoKbm90ZSBvdmVyAFoILCBmciwAGAs6CiAgUHJlY29uZGl0aW9uczogQ2xvdWQgZGVwbG95bWVudCwgU2VydmljZSByZWdpc3RyYXRpb24sIGYAgQYHaG9zdGluZwplbmQgbm90ZQoKAIFHBy0-AIE9BjoAgXkSAIFWBi0tPj4AgXMHOiBBY2tub3dsZWRnZW1lbnQAGwgAOwlQcmVwYQCBdwV2aWV3ABYJZnI6IEdldCBCYXNlbGluZQCCHAhzCmZyAHcKAAwSAFcIAIIACwCDAAZ6ZSBMaW5lU3RyaW5ncwoAgkQKAB4OUGVyZm9ybSAAgmYFc2kAGw4AgXAIAINRBmlzIFJlc3VsdABsCmZyOiBTdG9yAIEkC2xvb3AgcmVjdXJyaW5nCiAAhAwIAII8CkdldCBTdGF0dXMKICBhbHQgT3BlAIMHBiBpbmNvbXBsZXRlCiAgIACENActAIJTCgAuCWVsc2UALQsAGB5Mb2MAWQZvZiBcbgCBPBEgIGVuZAplbmQK&s=magazine&h=bv3g9EzcODmTzsBD)

*Note: This has not been implemented yet.*

#### Double-check - how are we decorating the output?

#### Information Exchange: Review Detection
###### Request
- Detection Review Parameters
  - Location of detected shorelines
  - Bounding box of detected shorelines
- Continuation Options
  - Select baseline shorelines from feature repository
  - Store baseline shorelines in key/value store
  - Call bf-analyze with detected shorelines, detected shorelines

###### Response
- Acknowledgement

#### Information Exchange: Get Baseline Features
###### Request
- Get Feature Request
  - Bounding box of detected shorelines

###### Response
- Baseline shorelines (GeoJSON)

#### Function: Provision Files
1. Store baseline shorelines in key/value store
1. Provision input files from key/value store
  - detected shorelines
  - baseline shorelines

#### Information Exchange: Analyze LineStrings
###### Request
- Detected shorelines
- Baseline shorelines

###### Response
[Detection Analysis Results](#detection-analysis-results)

#### Function: Perform Analysis
1. Qualitative analysis
1. Quantitative analysis
1. Write output file

#### Function: Store Analysis Results

#### Information Exchange: Get Status 
###### Request
- Job ID

###### Response
- Job Status
- If complete
  - [Detection Analysis Results](#detection-analysis-results)

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

#### Information Exchange: Map Request
###### Request (Analyst)
- WMS or WMTS request for map layer image

###### Response (Map Server)
- Map layer images (JPG most likely)

#### Function: Display Map
- Detected Shorelines
- Map layer image (as JPG)
