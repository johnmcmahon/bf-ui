# Harvest
This use case populates a catalog with scene metadata 
from an external image archive.

## Data Models
### Credentials
- Authentication Header, containing encoded:
  - Username
  - Password

### Harvest Options
- Image Archive (`planet` until further notice)
- API key for Image Archive (if needed)
- recurring
  - true: Establish recurring event 
- event
  - true: Post Piazza event on each harvested image
- dropIndex
  - true: drop the entire index, including all caches, before harvesting
- reharvest
  - true: ignore existing scenes and reharvest everything
  - false: stop when a scene already exists in catalog
- cap
  - true: caps catalog size to 1000 scenes (for testing only)
- optionsKey
  - not-empty: suffix for key containing harvest options (overrides everything above except for Image Archive and `event`)

### Event Type
- ID (read-only)
- Name
- Mapping

### Wrapped Event Type
- Data
  - [Event Type](#event-type)

### Scene Metadata
- image ID
- Bounding box (as GeoJSON Bounding Box or minx, miny, maxx, maxy)
- Acquired Date (ISO-8601)
- Sensor Name
- Link
- Resolution
- Percentage of cloud cover

### Image Descriptors
- ID
- URI (path)
- Small Thumbnail URI
- Large Thumbnail URI
- Metadata
  - Based on [Scene Metadata](#scene-metadata)
- Beachfront Evaluation Score (if available)
  
### Event
- Event Type ID
- Event ID (read-only)
- Mapping

## Concept of Operations
<img src="http://www.websequencediagrams.com/files/render?link=H4oWXErbvC8ZjH798BDi"/> [original file](https://www.websequencediagrams.com/?lz=dGl0bGUgSGFydmVzdCBJbWFnZSBNZXRhZGF0YQoKcGFydGljaXBhbnQgYmYtdWkABQ0AKAZDYXRhbG9nIGFzIGljACUNUGlhenphIGFzIHAABQUAKhNBcmNoaXZlADgFYQphdXRvbnVtYmVyIDEKCgBsBS0-aWM6AIEXCWV4aXN0aW5nIG0AgRsIaWMtPgCBFQU6IEFja25vd2xlZGdlbWVudAAWBQBzBjogR2V0IGV2ZW50IHR5cGUgaWQKAIENBi0tPgBcBUUAEgpJRApvcHQgaWYgbmVlZGVkCiAgAD4MUmVnaXN0ZXIARAsKZW5kCnJlZiBvdmVyIGljLCBpYQogIFNlZToAgkMPAIJhCGluZyBMb29wCmVuZCByZWYAYREAgXELRXN0YWJsaXNoIHJlY3VycmluZyBoAIMqBgogIABlEgBTJiAgAHMIZW5kCgo&s=magazine&h=7kBiS47sCgtqJvlC)

#### Information Exchange: Harvest Existing Metadata
###### Request
- [Credentials](#credentials)
- [Harvest Options](#harvest-options)

###### Response
- Acknowledgement -OR-
- Error Message

#### Retrieve Harvest Parameters
If a key is provided, retrieve the harvest parameters from storage.
This is generally used to support recurring harvests.

#### Authenticate
###### Request: GET piazza.../
- [Credentials](#credentials)

###### Response
- Acknowledgement -or-
- Error message

#### Function: Inspect authentication acknowledgement

#### Function: Drop index
- Delete all scenes from catalog
- Delete all caches

#### Function: Get Event Type ID for Harvest Events [see below](#register-event-type)
If we have to post events for each incoming scene,
we need to get the Event Type ID before starting the harvesting loop.

#### Function: Harvest Scene Metadata: [see below](#scene-metadata-harvesting-loop)

#### Function: Establish Recurring Harvest: [see below](#establish-recurring-harvest)

### Register Event Type
<img src="http://www.websequencediagrams.com/files/render?link=xexPzvZ_7Xw7P2gF9VtF"/> [original file](https://www.websequencediagrams.com/?lz=dGl0bGUgUmVnaXN0ZXIgRXZlbnQgVHlwZQoKcGFydGljaXBhbnQgY2xpZW50AAYNUGlhenphIGFzIHAABQUKCmF1dG9udW1iZXIgMQoKAC0GLT4AGAY6IEdldABUC3MKADAGLT4AVQY6AA8NADQIABQIQ2hlY2sgZm9yIG1hdGNoaW5nAIEeDG9wdCBpZiBubwAYBiBmb3VuZAogAIEuBwB4ClBvcwB3DAogAIEzBwB6CldyYXBwZWQAgXsMZW5kCgo&s=magazine&h=FdUb7I0kqqn53f18)

#### Information Exchange: Get Event Types
###### Request: GET `piazza.../eventType`
- [Credentials](#credentials)

###### Response
- [Event Types](#event-type)

#### Function: Check for matching Event Type
* Event type has the right prefix
* Event type has the same mapping

#### Information Exchange: Add Event Type
###### Request POST to `piazza.../eventType`
- Credentials
- [Event Type](#event-type)

###### Response
- [Wrapped Event Type](#wrapped-event-type)

### Scene Metadata Harvesting Loop
<img src="http://www.websequencediagrams.com/files/render?link=SbbUAEoyFBpmMLmwXf7J"/> [original file](https://www.websequencediagrams.com/?lz=dGl0bGUgSW1hZ2UgTWV0YWRhdGEgSGFydmVzdGluZyBMb29wCgpwYXJ0aWNpcGFudAAlB0NhdGFsb2cgYXMgaWMADRNBcmNoaXZlABsFYQAzDVBpYXp6YSBhcyBwAAUFCgphdXRvbnVtYmVyIDEKCmxvb3AgV2hpbGUgbmV3IGltYWdlcyByZW1haW4KICBpYy0-aWE6IFF1ZXJ5IGZvcgAcBiBtAIE2BwogIGlhLT5pYzoAgU8HAA0MYwATBlByb2Nlc3MgaW5jb21pbmcAXgcKICBvcHQgaWYgbmVlZGVkCiAgAGoGAIEjBjogUG9zdACBEAVldmVudAogIGVuZAplbmQKCg&s=magazine&h=KPnRD8l2gfwnA_Q_)

#### Information Exchange: Query for Image Metadata
###### Request
- Image Archive-specific

###### Response
- Image Archive-specific
   - [scene metadata](#scene-metadata)

#### Function: Add to Catalog
Add the scene to the main index.

#### Information Exchange: Post new event
###### Request: POST to `piazza.../event`
- [Credentials](#credentials)
- [Event](#event)
  - Mapping is based on [detection image criteria](#detection-image-criteria)

###### Response
- [Wrapped Event](#wrapped-event)

#### Function: Test Image
If sub-indexes exist, each scene needs to tested against the filter criteria (features)

#### Function: Add to Sub-Index
Add the scene to the designated sub-index.

### Establish Recurring Harvest
<img src="http://www.websequencediagrams.com/files/render?link=hoMAxWxVCEraLXuDncbf"/> [original file](https://www.websequencediagrams.com/?lz=dGl0bGUgRXN0YWJsaXNoIFJlY3VycmluZyBIYXJ2ZXN0CgpwYXJ0aWNpcGFudCBJbWFnZSBDYXRhbG9nIGFzIGljABMNUGlhenphIGFzIHAABQUKCmF1dG9udW1iZXIgMQoKaWMtPgAUBjogUG9zdCBTZXJ2aWNlCgApBi0-aWM6IEFja25vd2xlZGdlbWVudAAoDlVwZGF0ZQAOKmljOiBQZXJzaXN0IHIAgVQJaACBVwYgcGFyYW1ldGVycwoKcmVmIG92ZXIgaWMsAIE3ByAgR2V0AIICEiBFdmVudCBUeXBlIElECiAgc2VlIFJlZ2lzdGVyABILCmVuZCByZWYAgWUTQ3JvbgBBBgCBUSoAgiwFVHJpZ2dlcgCCEx4&s=magazine&h=7iCUDMDdjt_3LKPi)

#### Information Exchange: Post Service
###### Request: POST `piazza.../service`
- [Credentials](#credentials)
- Harvest Request URL
  - [Harvest Options](#harvest-options)

###### Response
- Wrapper
  - Service ID

#### Information Exchange: Update Service
Here we update the service URL with the Service ID 
which we also use when persisting the recurring harvest parameters.
This allows us to execute the recurring harvest on behalf of the person
who originally initiated the harvest operation.
###### Request: PUT `piazza.../service`
- [Credentials](#credentials)
- Harvest Request URL
  - [Harvest Options](#harvest-options)
  - Service ID

###### Response
- Wrapper

#### Function: Persist Harvest Options
By persisting the harvest options, 
we have the information we need to re-run the harvest later. 
We use the service ID as a suffix to the key.
This gives us a unique identifier.

#### Function: Get Recurring Event Type ID: [see above](#register-event-type)
This event has no payload.
We just need something that fires on a timer.

#### Information Exchange: Post Cron Event
###### Request: POST `piazza.../event`
- [Credentials](#credentials)
- Event Type ID
- Cron duration
- empty data

###### Response
- Data
  - Event ID

#### POST Trigger
###### Request: POST `piazza.../trigger`
- [Credentials](#credentials)
- Name "Beachfront Recurring Harvest"
- Event Type ID (from above)
- enabled `true`
- Job Type `execute-service`
- Job Service ID (from above)
- Job Inputs
  - none
- Job Output
  - Mime Type `text-plain`
  - Type `text`

###### Response
- Wrapper
