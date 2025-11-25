### Utility Endpoints
There are utility endpoints for the SVS API that can be used to retrieve information about the SVS API.

GET https://vsac.nlm.nih.gov/vsac/programs

Response
```json
{
  "Program": [
    {
      "name": "CMS FHIR eCQM Measure",
      "description": "eCQMs use data from electronic health records (EHR) and/or health information technology systems to measure health care quality. eCQM value sets specify terminology codes required for eCQM measurement and are updated by CMS one or more times each year."
    },
    {
      "name": "CMS FHIR® eCQM",
      "description": "FHIR eCQMs, based on the HL7® FHIR® standard, use data from electronic health records (EHR) and/or health information technology systems to measure health care quality. eCQM value sets specify terminology codes required for eCQM measurement and are updated by CMS one or more times each year."
    }
  ]
}
```

GET https://vsac.nlm.nih.gov/vsac/program/{programName}

Response
```json
{
  "name": "CMS FHIR® eCQM",
  "description": "FHIR eCQMs, based on the HL7® FHIR® standard, use data from electronic health records (EHR) and/or health information technology systems to measure health care quality. eCQM value sets specify terminology codes required for eCQM measurement and are updated by CMS one or more times each year.",
  "release": [
    {
      "name": "eCQM FHIR Update 2025",
      "releaseDate": 20251117,
      "isPublished": 0
    }
  ]
}
```

GET https://vsac.nlm.nih.gov/vsac/oid/{oid}/programs

Response
```
{
  "Program": [
    {
      "name": "CMS Pre-rulemaking eCQM",
      "description": "CMS pre-rulemaking eCQMs include measures that are developed, but specifications are not finalized for reporting in a CMS program. The Pre-rulemaking eCQM value sets specify terminology codes for use in these pre-rulemaking eCQMs."
    },
    {
      "name": "CMS eCQM and Hybrid Measure",
      "description": "eCQMs use data from electronic health records (EHR) and/or health information technology systems to measure health care quality. eCQM value sets specify terminology codes required for eCQM measurement and are updated by CMS one or more times each year."
    },
    {
      "name": "HL7® C-CDA",
      "description": "Consolidated Clinical Document Architecture (C-CDA) value sets provide standardized terminology for exchanging clinical information from electronic health records.    HL7 C-CDA and HL7 US Core implementation guides share value sets wherever possible."
    }
  ]
}
```

GET https://vsac.nlm.nih.gov/vsac/oid/{oid}/program/{programName}

Response
```
{
  "name": "CMS Pre-rulemaking eCQM",
  "description": "CMS pre-rulemaking eCQMs include measures that are developed, but specifications are not finalized for reporting in a CMS program. The Pre-rulemaking eCQM value sets specify terminology codes for use in these pre-rulemaking eCQMs.",
  "release": [
    {
      "name": "CMS Pre-rulemaking eCQM 2020-05-07",
      "releaseDate": 20200507
    },
    {
      "name": "CMS Pre-rulemaking eCQM 2019-08-30",
      "releaseDate": 20190830
    },
    {
      "name": "CMS Pre-rulemaking eCQM 2019-05-10",
      "releaseDate": 20190510
    }
  ]
}
```

GET https://vsac.nlm.nih.gov/vsac/oid/{oid}/versions

Response
```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<VersionList oid="2.16.840.1.114222.4.11.836">
    <version>Latest</version>
    <version>eCQM Update 2025-05-08</version>
    <version>C-CDA R3.0 2024-08-09</version>
```

GET https://vsac.nlm.nih.gov/vsac/profiles

Response
```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<ProfileList>
    <profile>Most Recent Code System Versions in VSAC</profile>
    <profile>Latest Active</profile>
    <profile>eCQM Update 2025-05-08</profile>
    <profile>C-CDA R3.0 2024-08-09</profile>
</ProfileList>
```

GET https://vsac.nlm.nih.gov/vsac/program/{programName}/latest profile

Response
```xml
{
    "name": "eCQM Update 2019-05-10",
    "requestTime": "2020-01-03 02:50:42 PM"
}
```

GET https://vsac.nlm.nih.gov/vsac/tagNames

Response
```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<tagNames>
    <name>CMS eMeasure ID|CMS eCQM ID</name>
    <name>eMeasure Identifier|eCQM Identifier</name>
    <name>NQF Number</name>
</tagNames>
```

GET https://vsac.nlm.nih.gov/vsac/tagName/{tagName}/tagValues

Response
```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<tagValues tagName="CMS eMeasure ID">
    <value>CMS100v1</value>
    <value>CMS100v2</value>
    <value>CMS100v3</value>
    <value>CMS100v4</value>
    <value>CMS100v5</value>
</tagValues>
``` 