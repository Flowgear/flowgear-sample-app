This repository is an app that will embed via iframe into the Flowgear Console at https://app.flowgear.net.

All http calls to retrive or send data are to be performed by calling Flowgear.Sdk.invoke (flowgear-webapp package). Flowgear acts as the middle/business layer and will in turn acquire data from or update underlying endpoints/apps.

Discover the list of API's that have been defined in Flowgear by reviewing the openapi.yml file in the root. Note that although these are API descriptors, they are to be invoked via calls to Flowgear.Sdk.invoke. This is crucial because the http invoke will
be performed by the Console which is hosting the iframe in which this app is embedded and it is only the Console that has access to the cookie that will be used to authenticate these calls. You should therefore ignore the servers, components and security sections of the openapi definition and instead path the http method and relative url of the call to Flowgear.Sdk.invoke
 



