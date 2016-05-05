# Shoreline Detection MVP2
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

### Detection Image Criteria
- Date of Collection (ISO-8601)
- Area of Interest (GeoJSON Geometry)
- Percentage of cloud cover (maximum)
- File format
- Bit depth
- Number of bands
- File size (maximum)

### Detection Inputs
- Algorithm ID
- Algorithm executable command
   - IDs of input file(s) 
   - Output file(s)
   - Additional parameters

### Image Descriptors
- ID
- URI (path)
- Thumbnail URI
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

### Detection Analysis Results
TBD

## Concept of Operations
### High Level
<img src="http://www.websequencediagrams.com/files/render?link=D9axg9OAxnfJh6duGlpZ"/>
[original file](https://www.websequencediagrams.com/?lz=dGl0bGUgRGV0ZWN0IFNob3JlbGluZSAyCgphdXRvbnVtYmVyIDEKCnBhcnRpY2lwYW50IEFuYWx5c3QABw1QaWF6emEKCk5vdGUgb3ZlcgAeCCwAFAc6IAogIFByZWNvbmRpdGlvbnM6IFNlcnZpY2UgcmVnaXN0cmF0aW9uLCBNZXRhZGF0YSBoYXJ2ZXN0aW5nCmVuZCBub3RlCgoAdgctPgCAfwc6IFNlbGVjdCBBT0kAEwtyZWYAgQEGAHYIRGlzYwCBEwVDYW5kaWRhdGUgSW1hZ2VzCiAgU2VlIE5vbWluAAsLZW5kIHJlZi0tPgBgCgAqEQBVG0V2YWx1YXRlAFgYABcJAFUbAIEcBSBTY29yAF8NAIFqEGkAIgV0byBhbmFseXplCgpvcHQgaWYgbmVlZGVkCiAAgyoILT4AgwQIR2V0AINuB2lvbiBBbGdvcml0aG1zCiAAg0MHAIFrDQAVFWVuZCAAglQdAIRFDwCCYQgABhIAglcUQWNrbm93bGVkZ2VtZW50AINkFEluc3AAg3QFABsQbG9vcCBSZWN1cnJpbmcAgWcYU3RhdHVzCiAgYWx0IE9wZQCEeQYgQ29tcGxldGUKICAAggMJAIRiClByb3Bvc2VkAIFJDmVsc2UgSW5jAB4dAGcJZW5kCmVuZACFNxRSZXZpZXcgcABeCHMAgjMK&s=magazine&h=QNPoqJueVeUx70un)

#### Preconditions
These activities are out of scope for this use case, but required for it to be successful.

##### Cloud Deployment
- [ ] service reporting the available detection algorithms
- [ ] pzsvc-search
- [ ] pzsvc-bf-eval
- [ ] pzsvc-exec
- [ ] detection algorithms
- [ ] pzsvc-bf-review

##### Service Registration
- [ ] service reporting the available detection algorithms
- [ ] pzsvc-search
- [ ] pzsvc-bf-eval
- [ ] pzsvc-exec
- [ ] pzsvc-bf-review

##### Metadata Harvesting
- [ ] One or more image archives must be established. They may be managed inside or outside Piazza. 
- [ ] The image catalog must be populated with metadata about available images from each image archive.

#### Information Exchange: Get Detection Algorithms
###### Request
- N/A

###### Response (JSON)
- [Detection Algorithms](#detection-algorithms)

###### Implementation Considerations
1. If the available algorithms are expected to be stable, this operation is unnecessary.
2. If users are constrained from using certain algorithms for some reason, this operation would be helpful.

#### Function: Display Detection Algorithms
- [Detection Algorithms](#detection-algorithms)

#### Information Exchange: Discover Images - [see below](#discover-images)

#### Function: Select Input Parameters
- [Detection Inputs](#detection-inputs)

#### Information Exchange: Ingest Image - [see below](#ingest-file)

#### Information Exchange: Detect Shorelines - [see below](#detect-shorelines)

#### Function: Review Detected Shorelines - [see below](#review-detected-shorelines)

#### Display Detected Shorelines - [see below](#display-detected-shorelines)

### Discover Images
<img src="http://www.websequencediagrams.com/files/render?link=vkRjFvkvfOmfdHLonhaF"/> [original file](https://www.websequencediagrams.com/?lz=dGl0bGUgRGlzY292ZXIgSW1hZ2VzCgpwYXJ0aWNpcGFudCBBbmFseXN0IGFzIGEABQYAEg1QaWF6emEgYXMgcAAFBQAvDQBLBSBDYXRhbG9nIGFzIGljAE8NcHpzdmMtYmYtZXZhbAoKYXV0b251bWJlciAxCgoAZwctPgBwBzogU2VsZWN0IHNlYXJjaCBjcml0ZXJpYQAfCgB8BjoAgUYKaQCBSgYAgRQGLS0-AEEKQWNrbm93bGVkZ2VtZW50ABsIPmljOiBTAFoGZm8AOAlpYwBTCgCBTgZNZXRhZGF0YQAwCQB0CFVwZGF0ZSBTdGF0dXMKb3B0IE9wdGlvbmFsCiAAghwHLT4AgWsNOiBFdmFsdWF0ZQCCeAggIGxvb3AgZWFjaACBPQYKICAgAIIfDgAzEQCCZQYAQwdpb24KICBlbmQKACUSAIEbDWQAgxwHRGVzY3JpcHRvcnMAgRsMAIE_FWVuZAoAgRsFUmVjdXJyaW5nCiAAhBMIAIJ6CkdldACBfQggIGFsdCBPcGVyAIEVBSBJbmNvbXBsZXQAgVEHAIJ0BwCDXQoALwhlbHNlAC0LQwAZHQCDCQ8AgXkGZW5kCg&s=magazine&h=qvQ8sbuINNK7POEF)

#### Function: Select Detection Image Criteria
- [Detection image criteria](#detection-image-criteria)

#### Information Exchange: Discover Images
###### Request (Analyst)
- [Detection image criteria](#detection-image-criteria) (JSON)
- Continuation Options (execute Evaluate Images if needed)

###### Response
- Acknowledgement

#### Function: Inspect Acknowledgement
The acknowledgement will provide either an error message or a job ID that can be used to monitor status.

#### Information Exchange: Search for Images
###### Request (Analyst) (JSON)
- [Detection image criteria](#detection-image-criteria)

###### Response (JSON)
- [Image Descriptors](#image-descriptors)

#### Function: Update Status

#### Information Exchange: Evaluate Images
###### Request (JSON)
- [Detection image criteria](#detection-image-criteria)
- [Image Descriptors](#image-descriptors)

###### Response (JSON)
- [Image Descriptors](#image-descriptors) including Beachfront Evaluation Score

#### Function: Image Evaluation
It is a too early to tell what criteria will be used to score these images but cloud cover and image resolution are obvious ones.
Some testing will need to be performed to determine what makes a good candidate image. 
It is possible that this operation will have to reach back to the Image Catalog or even the Image Archive.

#### Function: Update Status

#### Information Exchange: Get Status 
###### Request
- Job ID

###### Response (JSON)
- Job Status
- If Complete
  - [Image Descriptors](#image-descriptors) 

#### Function: Displayed Discovered Images
- [Image Descriptors](#image-descriptors)

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

#### Information Exchange: Get Detected Shorelines
###### Request
- File ID

###### Response
- [Detected Shorelines](#detected-shorelines) (GeoJSON)

#### Information Exchange: Store Detected Shorelines
###### Request
- [Detected Shorelines](#detected-shorelines) (GeoJSON)

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

### Detection Review
<img src="http://www.websequencediagrams.com/files/render?link=6JY0mf7cgq0XMgi0m96i"/>
[original file](https://www.websequencediagrams.com/?lz=dGl0bGUgUmV2aWV3IERldGVjdGlvbgoKYXV0b251bWJlciAxCgpwYXJ0aWNpcGFudCBBbmFseXN0AAcNUGlhenphABoNRmVhdHVyZSBSZXBvc2l0b3J5IGFzIGZyAD8NYmYtYW5hbHl6ZQoKbm90ZSBvdmVyAFoILCBmciwAGAs6CiAgUHJlY29uZGl0aW9uczogQ2xvdWQgZGVwbG95bWVudCwgU2VydmljZSByZWdpc3RyYXRpb24sIGYAgQYHaG9zdGluZwplbmQgbm90ZQoKAIFHBy0-AIE9BjoAgXkSAIFWBi0tPj4AgXMHOiBBY2tub3dsZWRnZW1lbnQAGwgAOwlQcmVwYQCBdwV2aWV3ABYJZnI6IEdldCBCYXNlbGluZQCCHAhzCmZyAHcKAAwSAFcIAIIACwCDAAZ6ZSBMaW5lU3RyaW5ncwoAgkQKAB4OUGVyZm9ybSAAgmYFc2kAGw4AgXAIAINRBmlzIFJlc3VsdABsCmZyOiBTdG9yAIEkC2xvb3AgcmVjdXJyaW5nCiAAhAwIAII8CkdldCBTdGF0dXMKICBhbHQgT3BlAIMHBiBpbmNvbXBsZXRlCiAgIACENActAIJTCgAuCWVsc2UALQsAGB5Mb2MAWQZvZiBcbgCBPBEgIGVuZAplbmQK&s=magazine&h=bv3g9EzcODmTzsBD)

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

#### Function: Display Detected Shorelines
