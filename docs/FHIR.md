## FHIR API

The FHIR API allows access to VSAC value sets and supported code systems using HL7 FHIR resources.

### Base URLs
Base URL: https://cts.nlm.nih.gov/fhir

### Authentication
The VSAC FHIR API authentication service requires a free UMLS account.
Use basic authentication with your UMLS API Key.

Authorization Type = Basic Auth
username = ‘apikey’ or leave it blank
password = user’s actual UMLS API Key
For all the endpoints, the Authorization header is required.
For returning format in json, add query parameter _format=json to the request. Example https://cts.nlm.nih.gov/fhir/CodeSystem/$lookup?code=1963-8&system=http%3A%2F%2Floinc.org&_format=json

### Endpoints

| Request Method | Path | Description | Related Utility Calls |
|---|---|---|---|
| GET | /ValueSet/{oid} | **Retrieve Value Set Definition:** Returns the ValueSet resource definition. | |
| GET | /ValueSet/{oid}/$expand | **Retrieve Value Set Expansion:** Returns the ValueSet resource with the expansion element containing the list of codes. | |
| GET | /ValueSet/{oid}/$expand/filter={query} | **Filter Value Set Expansion:** Retrieve expansion of codes and descriptors matching filter={query} within specified extensional value set. | |
| GET | /ValueSet/{oid}/$expand/manifest={profile_url} | **Retrieve Value Set Expansion using the specified profile:** Retrieve expansion of codes and descriptors within the specified profile. | |
| GET | /ValueSet/$validate-code?url={valueSetUrl}&code={code}&system={system} | **Validate Code in Value Set:** Validates if a code is in a specific Value Set. | |
| GET | /CodeSystem/$lookup?system={system}&code={code} | **Lookup Code:** Returns details about a specific code in a Code System. | |
| GET | /ValueSet?title={name} | **Search Value Set by Name:** Search for a Value Set by its name (mapped to FHIR title). | |

### Parameter Descriptions
| Parameter | Description | Use Case |
|---|---|---|
| oid | Value set object unique identifier (OID). | **Retrieve Value Set Definition**, **Retrieve Value Set Expansion** |
| url | Canonical URL of the Value Set. | **Validate Code in Value Set** |
| code | The code to look up or validate. | **Validate Code in Value Set**, **Lookup Code** |
| system | The system URI of the code (e.g., http://loinc.org). | **Validate Code in Value Set**, **Lookup Code** |
| title | The name of the Value Set. | **Search Value Set by Name** |


### CodeSystem Endpoints

| Request Method | Path | Description | Related Utility Calls |
|---|---|---|---|
| GET | /CodeSystem/{id} | **Retrieve Code System:** Retrieve details of a code system.. | |
| GET | /CodeSystem/$lookup?system={system}&code={code} | **Lookup Code:** Retrieve details of a code from a code system.. | |
| GET | /CodeSystem/$lookup?system={system}&code={code}&version={version} | **Lookup Code:** Retrieve details of a code from a code system version.. | |
| GET | /CodeSystem/$lookup?system={system}&code={code}&version={version}&date={date} | **Lookup Code:** Retrieve details of a code from a code system as of specified date. | |

### Response Examples


#### Valueset Search (/ValueSet?title={name})

```json
{
  "resourceType": "Bundle",
  "id": "valueset-search",
  "meta": {
    "lastUpdated": "2025-12-02T13:17:20.522-05:00"
  },
  "type": "searchset",
  "total": 3,
  "link": [ {
    "relation": "self",
    "url": "http://cts.nlm.nih.gov/fhir/res/ValueSet?title=Office%20Visit&_offset=0&_count=100"
  } ],
  "entry": [ {
    "fullUrl": "https://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1001",
    "resource": {
      "resourceType": "ValueSet",
      "id": "2.16.840.1.113883.3.464.1003.101.12.1001-20180310",
      "meta": {
        "versionId": "28",
        "lastUpdated": "2023-12-21T17:43:03.000-05:00",
        "profile": [ "http://hl7.org/fhir/StructureDefinition/shareablevalueset", "http://hl7.org/fhir/us/cqfmeasures/StructureDefinition/computable-valueset-cqfm", "http://hl7.org/fhir/us/cqfmeasures/StructureDefinition/publishable-valueset-cqfm" ],
        "tag": [ {
          "code": "SUBSETTED",
          "display": "subsetted"
        } ]
      },
      "extension": [ {
        "url": "http://hl7.org/fhir/StructureDefinition/valueset-author",
        "valueContactDetail": {
          "name": "NCQA PHEMUR Author"
        }
      }, {
        "url": "http://hl7.org/fhir/StructureDefinition/resource-lastReviewDate",
        "valueDate": "2025-03-10"
      }, {
        "url": "http://hl7.org/fhir/StructureDefinition/valueset-effectiveDate",
        "valueDate": "2018-03-10"
      } ],
      "url": "http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.12.1001",
      "identifier": [ {
        "system": "urn:ietf:rfc:3986",
        "value": "urn:oid:2.16.840.1.113883.3.464.1003.101.12.1001"
      } ],
      "version": "20180310",
      "name": "OfficeVisit",
      "title": "Office Visit",
      "status": "active",
      "experimental": false,
      "date": "2022-03-03T18:46:01-05:00",
      "publisher": "NCQA PHEMUR",
      "jurisdiction": [ {
        "extension": [ {
          "url": "http://hl7.org/fhir/StructureDefinition/data-absent-reason",
          "valueCode": "unknown"
        } ]
      } ],
      "purpose": "(Clinical Focus: The purpose of this value set is to represent concepts for encounters for an outpatient visit.),(Data Element Scope: This value set may use a model element related to Encounter.),(Inclusion Criteria: Includes concepts that represent an encounter for the comprehensive history, evaluation, and management of a patient presenting with minor to high severity problems.),(Exclusion Criteria: No exclusions.)"
    }
  }, {
    "fullUrl": "https://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.11.1005",
    "resource": {
      "resourceType": "ValueSet",
      "id": "2.16.840.1.113883.3.464.1003.101.11.1005-20251022",
      "meta": {
        "versionId": "30",
        "lastUpdated": "2025-10-22T01:02:48.000-04:00",
        "profile": [ "http://hl7.org/fhir/StructureDefinition/shareablevalueset", "http://hl7.org/fhir/us/cqfmeasures/StructureDefinition/computable-valueset-cqfm", "http://hl7.org/fhir/us/cqfmeasures/StructureDefinition/publishable-valueset-cqfm" ],
        "tag": [ {
          "code": "SUBSETTED",
          "display": "subsetted"
        } ]
      },
      "extension": [ {
        "url": "http://hl7.org/fhir/StructureDefinition/valueset-author",
        "valueContactDetail": {
          "name": "NCQA PHEMUR Author"
        }
      }, {
        "url": "http://hl7.org/fhir/StructureDefinition/resource-lastReviewDate",
        "valueDate": "2025-10-22"
      }, {
        "url": "http://hl7.org/fhir/StructureDefinition/valueset-effectiveDate",
        "valueDate": "2025-10-22"
      } ],
      "url": "http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.11.1005",
      "identifier": [ {
        "system": "urn:ietf:rfc:3986",
        "value": "urn:oid:2.16.840.1.113883.3.464.1003.101.11.1005"
      } ],
      "version": "20251022",
      "name": "OfficeVisit",
      "title": "Office Visit",
      "status": "active",
      "date": "2025-10-22T01:02:48-04:00",
      "publisher": "NCQA PHEMUR",
      "jurisdiction": [ {
        "extension": [ {
          "url": "http://hl7.org/fhir/StructureDefinition/data-absent-reason",
          "valueCode": "unknown"
        } ]
      } ],
      "purpose": "(Clinical Focus: The purpose of this value set is to represent concepts for encounters for an outpatient visit.),(Data Element Scope: This value set may use a model element related to Encounter.),(Inclusion Criteria: Includes concepts that represent an encounter for the comprehensive history, evaluation, and management of a patient presenting with minor to high severity problems.),(Exclusion Criteria: No exclusions.)"
    }
  }, {
    "fullUrl": "https://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.11.1264",
    "resource": {
      "resourceType": "ValueSet",
      "id": "2.16.840.1.113883.3.464.1003.101.11.1264-20250118",
      "meta": {
        "versionId": "16",
        "lastUpdated": "2025-01-18T01:03:28.000-05:00",
        "profile": [ "http://hl7.org/fhir/StructureDefinition/shareablevalueset", "http://hl7.org/fhir/us/cqfmeasures/StructureDefinition/computable-valueset-cqfm", "http://hl7.org/fhir/us/cqfmeasures/StructureDefinition/publishable-valueset-cqfm" ],
        "tag": [ {
          "code": "SUBSETTED",
          "display": "subsetted"
        } ]
      },
      "extension": [ {
        "url": "http://hl7.org/fhir/StructureDefinition/valueset-author",
        "valueContactDetail": {
          "name": "NCQA PHEMUR Author"
        }
      }, {
        "url": "http://hl7.org/fhir/StructureDefinition/resource-lastReviewDate",
        "valueDate": "2025-01-18"
      }, {
        "url": "http://hl7.org/fhir/StructureDefinition/valueset-effectiveDate",
        "valueDate": "2025-01-18"
      } ],
      "url": "http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.101.11.1264",
      "identifier": [ {
        "system": "urn:ietf:rfc:3986",
        "value": "urn:oid:2.16.840.1.113883.3.464.1003.101.11.1264"
      } ],
      "version": "20250118",
      "name": "OfficeVisit",
      "title": "Office Visit",
      "status": "active",
      "date": "2025-01-18T01:03:28-05:00",
      "publisher": "NCQA PHEMUR",
      "jurisdiction": [ {
        "extension": [ {
          "url": "http://hl7.org/fhir/StructureDefinition/data-absent-reason",
          "valueCode": "unknown"
        } ]
      } ],
      "purpose": "(Clinical Focus: The purpose of this value set is to represent concepts for encounters for an outpatient visit.),(Data Element Scope: This value set may use a model element related to Encounter.),(Inclusion Criteria: Includes concepts that represent an encounter for the comprehensive history, evaluation, and management of a patient presenting with minor to high severity problems.),(Exclusion Criteria: No exclusions.)"
    }
  } ]
}
```

#### ValueSet Response (/ValueSet/{oid})
```json
{
  "resourceType": "ValueSet",
  "id": "2.16.840.1.113883.3.464.1003.113.11.1090",
  "meta": {
    "versionId": "5",
    "lastUpdated": "2024-08-12T09:27:40.000-04:00",
    "profile": [ "http://hl7.org/fhir/StructureDefinition/shareablevalueset", "http://hl7.org/fhir/us/cqfmeasures/StructureDefinition/computable-valueset-cqfm", "http://hl7.org/fhir/us/cqfmeasures/StructureDefinition/publishable-valueset-cqfm" ]
  },
  "extension": [ {
    "url": "http://hl7.org/fhir/StructureDefinition/valueset-author",
    "valueContactDetail": {
      "name": "American Institutes for Research Author"
    }
  }, {
    "url": "http://hl7.org/fhir/StructureDefinition/resource-lastReviewDate",
    "valueDate": "2024-02-13"
  }, {
    "url": "http://hl7.org/fhir/StructureDefinition/valueset-effectiveDate",
    "valueDate": "2018-03-10"
  } ],
  "url": "http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.113.11.1090",
  "identifier": [ {
    "system": "urn:ietf:rfc:3986",
    "value": "urn:oid:2.16.840.1.113883.3.464.1003.113.11.1090"
  } ],
  "version": "20180310",
  "name": "AnkylosingSpondylitis",
  "title": "Ankylosing Spondylitis",
  "status": "active",
  "experimental": false,
  "date": "2018-03-10T01:00:08-05:00",
  "publisher": "American Institutes for Research Steward",
  "description": "for dxa measure",
  "jurisdiction": [ {
    "extension": [ {
      "url": "http://hl7.org/fhir/StructureDefinition/data-absent-reason",
      "valueCode": "unknown"
    } ]
  } ],
  "purpose": "(Clinical Focus: The purpose of this value set is to represent concepts for a diagnosis of  ankylosing spondylitis.),(Data Element Scope: This value set may use a model element related to Diagnosis.),(Inclusion Criteria: Includes concepts that represent a diagnosis of ankylosing spondylitis with comorbidities and associated system involvement.),(Exclusion Criteria: Excludes concepts that represent a diagnosis of juvenile ankylosing spondylitis.)",
  "compose": {
    "include": [ {
      "system": "http://hl7.org/fhir/sid/icd-10-cm",
      "concept": [ {
        "code": "M45.0",
        "display": "Ankylosing spondylitis of multiple sites in spine"
      }, {
        "code": "M45.1",
        "display": "Ankylosing spondylitis of occipito-atlanto-axial region"
      }, {
        "code": "M45.2",
        "display": "Ankylosing spondylitis of cervical region"
      }, {
        "code": "M45.3",
        "display": "Ankylosing spondylitis of cervicothoracic region"
      }, {
        "code": "M45.4",
        "display": "Ankylosing spondylitis of thoracic region"
      }, {
        "code": "M45.5",
        "display": "Ankylosing spondylitis of thoracolumbar region"
      }, {
        "code": "M45.6",
        "display": "Ankylosing spondylitis lumbar region"
      }, {
        "code": "M45.7",
        "display": "Ankylosing spondylitis of lumbosacral region"
      }, {
        "code": "M45.8",
        "display": "Ankylosing spondylitis sacral and sacrococcygeal region"
      }, {
        "code": "M45.9",
        "display": "Ankylosing spondylitis of unspecified sites in spine"
      } ]
    } ]
  }
}
```

#### ValueSet Expansion Response (/ValueSet/{oid}/$expand, /ValueSet/{oid}/$expand/filter={query}, /ValueSet/{oid}/$expand/manifest={profile_url})
```json
{
  "resourceType": "ValueSet",
  "id": "2.16.840.1.113883.3.464.1003.113.11.1090",
  "meta": {
    "versionId": "5",
    "lastUpdated": "2024-08-12T09:27:40.000-04:00",
    "profile": [ "http://hl7.org/fhir/StructureDefinition/shareablevalueset", "http://hl7.org/fhir/us/cqfmeasures/StructureDefinition/computable-valueset-cqfm", "http://hl7.org/fhir/us/cqfmeasures/StructureDefinition/publishable-valueset-cqfm" ]
  },
  "extension": [ {
    "url": "http://hl7.org/fhir/StructureDefinition/valueset-effectiveDate",
    "valueDate": "2018-03-10"
  } ],
  "url": "http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.113.11.1090",
  "identifier": [ {
    "system": "urn:ietf:rfc:3986",
    "value": "urn:oid:2.16.840.1.113883.3.464.1003.113.11.1090"
  } ],
  "version": "20180310",
  "name": "AnkylosingSpondylitis",
  "title": "Ankylosing Spondylitis",
  "status": "active",
  "experimental": false,
  "date": "2018-03-10T01:00:08-05:00",
  "publisher": "American Institutes for Research Steward",
  "expansion": {
    "identifier": "urn:uuid:5b8e40c3-5d44-4166-ae40-939b1b5601c1",
    "timestamp": "2025-12-02T13:07:45-05:00",
    "total": 10,
    "offset": 0,
    "parameter": [ {
      "name": "count",
      "valueInteger": 1000
    }, {
      "name": "offset",
      "valueInteger": 0
    } ],
    "contains": [ {
      "system": "http://hl7.org/fhir/sid/icd-10-cm",
      "version": "2026",
      "code": "M45.0",
      "display": "Ankylosing spondylitis of multiple sites in spine"
    }, {
      "system": "http://hl7.org/fhir/sid/icd-10-cm",
      "version": "2026",
      "code": "M45.1",
      "display": "Ankylosing spondylitis of occipito-atlanto-axial region"
    }, {
      "system": "http://hl7.org/fhir/sid/icd-10-cm",
      "version": "2026",
      "code": "M45.2",
      "display": "Ankylosing spondylitis of cervical region"
    }, {
      "system": "http://hl7.org/fhir/sid/icd-10-cm",
      "version": "2026",
      "code": "M45.3",
      "display": "Ankylosing spondylitis of cervicothoracic region"
    }, {
      "system": "http://hl7.org/fhir/sid/icd-10-cm",
      "version": "2026",
      "code": "M45.4",
      "display": "Ankylosing spondylitis of thoracic region"
    }, {
      "system": "http://hl7.org/fhir/sid/icd-10-cm",
      "version": "2026",
      "code": "M45.5",
      "display": "Ankylosing spondylitis of thoracolumbar region"
    }, {
      "system": "http://hl7.org/fhir/sid/icd-10-cm",
      "version": "2026",
      "code": "M45.6",
      "display": "Ankylosing spondylitis lumbar region"
    }, {
      "system": "http://hl7.org/fhir/sid/icd-10-cm",
      "version": "2026",
      "code": "M45.7",
      "display": "Ankylosing spondylitis of lumbosacral region"
    }, {
      "system": "http://hl7.org/fhir/sid/icd-10-cm",
      "version": "2026",
      "code": "M45.8",
      "display": "Ankylosing spondylitis sacral and sacrococcygeal region"
    }, {
      "system": "http://hl7.org/fhir/sid/icd-10-cm",
      "version": "2026",
      "code": "M45.9",
      "display": "Ankylosing spondylitis of unspecified sites in spine"
    } ]
  }
}
```

#### Invalid oid response (/ValueSet/{oid}, /ValueSet/{oid}/$expand)
```json
// status code 404
{
  "resourceType": "OperationOutcome",
  "issue": [ {
    "extension": [ {
      "url": "http://hl7.org/fhir/StructureDefinition/operationoutcome-issue-source",
      "valueString": "GET - http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.113.11.109x"
    } ],
    "severity": "error",
    "code": "processing",
    "diagnostics": "HAPI-0971: Resource ValueSet/2.16.840.1.113883.3.464.1003.113.11.109x is not known"
  } ]
}
```

#### CodeSystem Lookup Response (Simplified)
```json
{
  "resourceType": "Parameters",
  "parameter": [ {
    "name": "name",
    "valueString": "LOINC"
  }, {
    "name": "version",
    "valueString": "2.56"
  }, {
    "name": "display",
    "valueString": "Bicarbonate [Moles/volume] in Serum"
  }, {
    "name": "Oid",
    "valueString": "2.16.840.1.113883.6.1"
  } ]
}
```

#### CodeSystem Response
```json
{
  "resourceType": "CodeSystem",
  "id": "CDCREC",
  "meta": {
    "versionId": "2654722723",
    "lastUpdated": "2025-08-13T00:00:00-04:00",
    "profile": [ "http://hl7.org/fhir/StructureDefinition/shareablecodesystem", "http://hl7.org/fhir/us/cqfmeasures/StructureDefinition/publishable-codesystem-cqfm" ]
  },
  "url": "urn:oid:2.16.840.1.113883.6.238",
  "identifier": [ {
    "system": "urn:ietf:rfc:3986",
    "value": "urn:oid:2.16.840.1.113883.6.238"
  } ],
  "version": "1.3",
  "name": "CDCREC",
  "title": "CDC Race and Ethnicity",
  "status": "active",
  "experimental": false,
  "date": "2024-12-04T00:00:00-05:00",
  "content": "example",
  "count": 1324,
  "concept": [ {
    "code": "1236-9",
    "display": "Georgetown"
  } ]
}
```

#### Invalid codesystem response
```json
// status code 404
{
  "resourceType": "OperationOutcome",
  "text": {
    "status": "generated",
    "div": "<div xmlns=\"http://www.w3.org/1999/xhtml\"><table class=\"grid\"><tr><td><b>Severity</b></td><td><b>Location</b></td><td><b>Code</b></td><td><b>Details</b></td><td><b>Diagnostics</b></td></tr><tr><td>ERROR</td><td/><td>Not Found</td><td/><td>Unable to find code 1963-843 in http://loinc.org</td></tr></table></div>"
  },
  "issue": [ {
    "extension": [ {
      "url": "http://hl7.org/fhir/StructureDefinition/operationoutcome-issue-source",
      "valueString": "GET - http://cts.nlm.nih.gov/fhir/CodeSystem/$lookup?system=http://loinc.org&code=1963-843"
    } ],
    "severity": "error",
    "code": "not-found",
    "diagnostics": "Unable to find code 1963-843 in http://loinc.org"
  } ]
}
```

