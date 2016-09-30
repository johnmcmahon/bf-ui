# SubIndex
This use case establishes a sub-index that limits the scenes available for discovery.
Once the sub-index is established, a parameter allows it to be used instead of the entire catalog.

## Concept of Operations
### High Level
<img src="http://www.websequencediagrams.com/files/render?link=RX-skMN-6phHnjoDE_XX"/>
[original file](https://www.websequencediagrams.com/?lz=dGl0bGUgRXN0YWJsc2ggU3ViSW5kZXgKCnBhcnRpY2lwYW50IGJmLXVpIGFzIGNsaWVudAAPDXB6c3ZjLWltYWdlLWNhdGFsb2cAJQUABQYAOg1XRlMKCmF1dG9udW1iZXIgMQoKAEsGLT4AMwc6AIEDB2kAgH8MAE8HLT5XRlM6IEdldEZlYXR1cmVzCldGUwAwCwAOCQAoCQBNCVRpbGUgZgAQEC0-PgCBSwY6IEFja25vd2xlZGdlbWVudApsb29wIGZvciBlYWNoIGlucHV0IHNjZW5lCiAgAA4OdGlsZWQAVAgKICAgAIFzCACBSgtDaGVjawBKBWludGVyc2VjdGlvbgAoBW9wdCBpZgANC25nAEAFADMUQWRkIHRvIHN1YmkAgx8FICAgIGVuZAoAAQUKZW5kCg&s=magazine&h=cE0NNmx1cLCGjNtA)

#### Information Exchange: Establish SubIndex
###### Request
- Name
- WFS URL
- WFS Layer Name (type name)

###### Response
Acknowledgement

#### Information Exchange: GetFeatures
###### Request: GET(WFS URL)
- request: GetFeature
- version: 2.0.0
- outputFormat: application/json
- count: 9999
- type name

###### Response
- GeoJSON FeatureCollection

#### Function: Tile Features
In order to query this FeatureCollection relatively quickly, 
split the world into pieces and put each feature into one

#### Function: Check for Intersection
Check to see if the bounding box for a scene
overlaps the bounding box of a feature from our tile set

#### Function: Add to SubIndex
The subindex is identified by a suffix that corresponds to the details of the GetFeature request that spawned it.
