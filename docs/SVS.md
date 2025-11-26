## SVS API

The SVS API can be as follows

### Base URLs
Content (SVS API) URL https://vsac.nlm.nih.gov/vsac/svs

RetrieveValueSet
Use this request to retrieve only the value set concept list. This request does not retrieve value set metadata content.
RetrieveMultipleValueSets
Use this request to retrieve value set metadata content as well as the value set concept list.


### Authentication
The VSAC SVS API authentication service requires a free UMLS account.
Use basic authentication with your UMLS API Key.
For example, if you are using a platform such as Postman, choose:

Authorization Type = Basic Auth
username = ‘apikey’ or leave it blank
password = user’s actual UMLS API Key
For software developers, here is a Java example of embedding a VSAC SVS API call within a program.

You can find your API Key in the My Profile area of the UMLS Terminology Services (UTS) after signing in. If the API Key field in your UTS profile is blank, click Edit Profile, select the Generate New API Key checkbox, then scroll down and click Save Profile. Your new API Key is now available for use. An API Key remains active as long as the associated UTS account is active.


### Endpoints   

| Request Method | Path | Description | Related Utility Calls |
|---|---|---|---|
| GET | /RetrieveMultipleValueSets?id={oid} | **Retrieve Most Recent Value Set Expansions:** includes value set metadata and concept list. | |
| GET | /RetrieveValueSet?id={oid} | **Retrieve Most Recent Value Set Expansions:** includes only value set concept list, no metadata. | |
| GET | /RetrieveMultipleValueSets?id={oid}&release={releaseName} | **Retrieve Value Set Expansions Published by a Program Release** | [https://vsac.nlm.nih.gov/vsac/programs](https://vsac.nlm.nih.gov/vsac/programs)<br><br>[https://vsac.nlm.nih.gov/vsac/program/{programName}](https://vsac.nlm.nih.gov/vsac/program/{programName})<br><br>[https://vsac.nlm.nih.gov/vsac/oid/{oid}/programs](https://vsac.nlm.nih.gov/vsac/oid/{oid}/programs)<br><br>[https://vsac.nlm.nih.gov/vsac/oid/{oid}/program/{programName}](https://vsac.nlm.nih.gov/vsac/oid/{oid}/program/{programName}) |
| GET | /RetrieveMultipleValueSets?id={oid}&version={version} | **Retrieve Value Set Expansion for a Specified Expansion Version** | [https://vsac.nlm.nih.gov/vsac/oid/{oid}/versions](https://vsac.nlm.nih.gov/vsac/oid/{oid}/versions) |
| GET | /RetrieveMultipleValueSets?id={oid}&profile={profileName} | **Retrieve Value Set Expansion Calculated with Expansion Profile:** Use the utility call [https://vsac.nlm.nih.gov/vsac/program/{programName}/latest profile](https://vsac.nlm.nih.gov/vsac/program/{programName}/latest%20profile) to retrieve a specified program's (example: "CMS eCQM and Hybrid Measure") latest expansion profile. | [https://vsac.nlm.nih.gov/vsac/profiles](https://vsac.nlm.nih.gov/vsac/profiles)<br><br>[https://vsac.nlm.nih.gov/vsac/program/{programName}/latest profile](https://vsac.nlm.nih.gov/vsac/program/{programName}/latest%20profile) |
| GET | /RetrieveMultipleValueSets?id={oid}&profile={profileName}&includeDraft=yes | **Retrieve Value Set Expansion of a Draft Value Set Definition:** Use the includeDraft parameter to retrieve a temporary expansion of draft value set content. Only VSAC authors and stewards, who are members of at least one VSAC author or steward group, have permissions to retrieve any draft content. | [https://vsac.nlm.nih.gov/vsac/profiles](https://vsac.nlm.nih.gov/vsac/profiles)<br><br>[https://vsac.nlm.nih.gov/vsac/program/{programName}/latest profile](https://vsac.nlm.nih.gov/vsac/program/{programName}/latest%20profile) |
| GET | /RetrieveMultipleValueSets?tagName={tagName}&tagValue={tagValue} | **Retrieve Expansions for All Value Sets Specified by a CMS eMeasure ID, or eMeasure Identifier, or NQF Number** | [https://vsac.nlm.nih.gov/vsac/tagNames](https://vsac.nlm.nih.gov/vsac/tagNames)<br><br>[https://vsac.nlm.nih.gov/vsac/tagName/{tagName}/tagValues](https://vsac.nlm.nih.gov/vsac/tagName/{tagName}/tagValues) |
| GET | /RetrieveMultipleValueSets?id={oid}&effectiveDate={yyyymmdd} | **Retrieve a Value Set Expansion Published on or before a Specific Date** | |
| GET | /RetrieveMultipleValueSets?id={oid}&effectiveDate={yyyymmdd}&programType=eCQM | **Retrieve a Value Set Expansion Published on or before a Specific Date** in the most recent eCQM program release. | |



#### RetrieveValueSet Response
```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<ns0:RetrieveValueSetResponse
  xmlns:ns0="urn:ihe:iti:svs:2008"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <ns0:ValueSet ID="2.16.840.1.114222.4.11.837" displayName="Ethnicity" version="Latest">
    <ns0:ConceptList>
      <ns0:Concept code="2135-2" codeSystem="2.16.840.1.113883.6.238" codeSystemName="CDCREC" codeSystemVersion="1.3" displayName="Hispanic or Latino"/>
      <ns0:Concept code="2186-5" codeSystem="2.16.840.1.113883.6.238" codeSystemName="CDCREC" codeSystemVersion="1.3" displayName="Not Hispanic or Latino"/>
    </ns0:ConceptList>
  </ns0:ValueSet>
</ns0:RetrieveValueSetResponse>
```
This response should be converted to
```json
{
    "id": "2.16.840.1.114222.4.11.837",
    "displayName": "Ethnicity",
    "version": "Latest",
    "Concepts": [
      {
        "code": "2135-2",
        "codeSystem": "2.16.840.1.113883.6.238",
        "codeSystemName": "CDCREC",
        "codeSystemVersion": "1.3",
        "displayName": "Hispanic or Latino"
      },
      {
        "code": "2186-5",
        "codeSystem": "2.16.840.1.113883.6.238",
        "codeSystemName": "CDCREC",
        "codeSystemVersion": "1.3",
        "displayName": "Not Hispanic or Latino"
      }
    ]
}
```

#### RetrieveMultiplValuesets Reponse
```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<ns0:RetrieveMultipleValueSetsResponse
  xmlns:ns0="urn:ihe:iti:svs:2008"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <ns0:DescribedValueSet ID="2.16.840.1.114222.4.11.836" displayName="Race" version="Latest">
    <ns0:ConceptList>
      <ns0:Concept code="1002-5" codeSystem="2.16.840.1.113883.6.238" codeSystemName="CDCREC" codeSystemVersion="1.3" displayName="AMERICAN INDIAN OR ALASKA NATIVE"/>
      <ns0:Concept code="2028-9" codeSystem="2.16.840.1.113883.6.238" codeSystemName="CDCREC" codeSystemVersion="1.3" displayName="Asian"/>
      <ns0:Concept code="2054-5" codeSystem="2.16.840.1.113883.6.238" codeSystemName="CDCREC" codeSystemVersion="1.3" displayName="Black or African American"/>
      <ns0:Concept code="2076-8" codeSystem="2.16.840.1.113883.6.238" codeSystemName="CDCREC" codeSystemVersion="1.3" displayName="Native Hawaiian or Other Pacific Islander"/>
      <ns0:Concept code="2106-3" codeSystem="2.16.840.1.113883.6.238" codeSystemName="CDCREC" codeSystemVersion="1.3" displayName="White"/>
      <ns0:Concept code="2131-1" codeSystem="2.16.840.1.113883.6.238" codeSystemName="CDCREC" codeSystemVersion="1.3" displayName="Other Race"/>
    </ns0:ConceptList>
    <ns0:Source>Centers for Disease Control National Center for Health Statistics</ns0:Source>
    <ns0:Purpose>(Clinical Focus: ),(Data Element Scope: ),(Inclusion Criteria: ),(Exclusion Criteria: )</ns0:Purpose>
    <ns0:Type>Extensional</ns0:Type>
    <ns0:Binding>Dynamic</ns0:Binding>
    <ns0:Status>Active</ns0:Status>
    <ns0:RevisionDate>2012-10-25</ns0:RevisionDate>
  </ns0:DescribedValueSet>
</ns0:RetrieveMultipleValueSetsResponse>
```

This should be converted to
```json
{
      {
        "id": "2.16.840.1.114222.4.11.836",
        "displayName": "Race",
        "version": "Latest",
        "Concepts": [
          {
            "code": "1002-5",
            "codeSystem": "2.16.840.1.113883.6.238",
            "codeSystemName": "CDCREC",
            "codeSystemVersion": "1.3",
            "displayName": "AMERICAN INDIAN OR ALASKA NATIVE"
          },
          {
            "code": "2028-9",
            "codeSystem": "2.16.840.1.113883.6.238",
            "codeSystemName": "CDCREC",
            "codeSystemVersion": "1.3",
            "displayName": "Asian"
          },
          {
            "code": "2054-5",
            "codeSystem": "2.16.840.1.113883.6.238",
            "codeSystemName": "CDCREC",
            "codeSystemVersion": "1.3",
            "displayName": "Black or African American"
          },
          {
            "code": "2076-8",
            "codeSystem": "2.16.840.1.113883.6.238",
            "codeSystemName": "CDCREC",
            "codeSystemVersion": "1.3",
            "displayName": "Native Hawaiian or Other Pacific Islander"
          },
          {
            "code": "2106-3",
            "codeSystem": "2.16.840.1.113883.6.238",
            "codeSystemName": "CDCREC",
            "codeSystemVersion": "1.3",
            "displayName": "White"
          },
          {
            "code": "2131-1",
            "codeSystem": "2.16.840.1.113883.6.238",
            "codeSystemName": "CDCREC",
            "codeSystemVersion": "1.3",
            "displayName": "Other Race"
          }
        ],
        "source": "Centers for Disease Control National Center for Health Statistics",
        "purpose": "(Clinical Focus: ),(Data Element Scope: ),(Inclusion Criteria: ),(Exclusion Criteria: )",
        "type": "Extensional",
        "binding": "Dynamic",
        "status": "Active",
        "revisionDate": "2012-10-25"
      }
}
```

### Parameter Descriptions
| Parameter | Description | Use Case |
|---|---|---|
| effectiveDate | A date on or before which a published value set expansion is published and available in the VSAC public repository. | **Retrieve a Value Set Expansion Published on or before a Specific Date** |
| id | Value set object unique identifier (OID). | |
| includeDraft | Allows retrieval of a non-published draft value set definition. Value is 'yes' or 'no'. | **Retrieve Value Set Expansion of a Draft Value Set Definition** |
| latest profile | A specified program's latest expansion profile label that defines a calculation algorithm that applies predetermined code system versions and legacy codes. Example: 'eCQM Update 2020-05-07'. | **Retrieve Value Set Expansion Calculated with Expansion Profile** |
| profile | An expansion profile label that defines a calculation algorithm that applies predetermined code system versions and legacy codes. Examples: 'eCQM Update 2019-05-10', or 'Most Recent Code System Versions in VSAC'. | **Retrieve Value Set Expansion Calculated with Expansion Profile** |
| program | "Program" is the word VSAC applies to the administrative organization and/or application that sponsors, authors and stewards a published release of value sets that together serve a purpose. A program has a pre-arranged agreement with VSAC to publish their value sets as a group. | **VSAC Utility API Calls: 'programs' and 'latest profile' for program:**<ul><li>Retrieve all release names and releaseDates for a given program name</li><li>Retrieve all published program releases (release names) for a given value set OID and program name</li><li>Return the value of the most recently available expansion profile to be used by the specified program in an upcoming VSAC program release of that program's value set content. Value of latest profile is subject to change according to the goals of the program it represents</li></ul> |
| programs | Retrieve all program name values for programs supported by VSAC. | **VSAC Utility API Calls: 'programs' and 'latest profile' for program:**<ul><li>Retrieve available values for programs that will enable you to then retrieve release name values for a program of interest.</li></ul> |
| programType | The name of a program that contains the requested OID. Available value: eCQM | **Retrieve a Value Set Expansion Published on or before a Specific Date:** by a specified program. |
| release | Name of a program release. A program release contains multiple pre-selected value sets designated by the program's release manager. | **Retrieve Value Set Expansions Published by a Program Release** |
| tagName | A tag for a collection of value sets, for example: 'CMS eMeasure ID'. Must be used together with 'tagValue'. | **Retrieve Expansions for All Value Sets Specified by a CMS eMeasure ID, or eMeasure Identifier, or NQF Number** |
| tagNames | Retrieves all supported tagNames. | **Retrieve Expansions for All Value Sets Specified by a CMS eMeasure ID, or eMeasure Identifier, or NQF Number** |
| tagValue | The value of a member within a collection (tagName) of value sets. For example, 'CMS68v9' is one of the valid values (tagValue) within the tagName CMS eMeasure ID. | **Retrieve Expansions for All Value Sets Specified by a CMS eMeasure ID, or eMeasure Identifier, or NQF Number** |
| tagValues | Retrieves all supported tagValues. | **Retrieve Expansions for All Value Sets Specified by a CMS eMeasure ID, or eMeasure Identifier, or NQF Number** |
| version | A release version label that uniquely identifies a specific value set expansion. For example: 'eCQM Update 2017-05-05' or '20170505'. | **Retrieve Value Set Expansion for a Specified Expansion Version** |


### HTTP Binding
All the value set transactions described in this document are represented by a RESTful URL and one or more request parameters. The HTTP request uses the GET method for RetrieveValueSet and RetrieveMultipleValueSets. Encode each parameter as an HTTP Get parameter. The Content-Type field of the HTTP header shall be 'text/xml'. The HTTP request returns an error code if the request parameters are invalid, or if the specified parameter combination is not supported. The request returns an HTTP status code of 404, with an HTTP Warning header containing warning code 111, and warning text 'INV: Invalid search parameters'. A request with valid parameters and parameter combinations that finds no matching value set is not an error. It will return an empty body with HTTP status code of 200.