# ACI Beam Design Table

#### Video Demo: https://youtu.be/91nEMc-5Gyk

#### GitHub Repo: https://github.com/Icomanman/beam-table

#### Description:

This is a web app inspired by my work as a structural engineer. Much of the calculations involved in the design of reinforced concrete beams are a bit repetitive, hence I made this app to be able to provide a quick reference for their design under the (American Concrete Institute) ACI code. Furthermore, presenting the data in this way (table format) would give the user a more wider sense in terms of different options on section sizes, material properties and other related details.

Ultimately, the design process would be a lot efficient and simpler this way once design forces are available, all the engineer has to do is to match them with the values on the table.

### JavaScript Frameworks and Libraries

As I am already familiar with some JavaScript libraries and frameworks, I made extensive use of them in creating this project.

For CSS and related functionalities, I made use of Semantic UI, as I am at a comfortable level working with it based on my experience building other projects. For page interactions and controls, I mixed both jQuery and Vuejs.

jQuery is a necessary for some functionalities of Semantic UI to work like dropdowns and modals. Hence, I did stick to it in some areas including the pulling of data from the Properties form. Also, the input validations were also done using Semantic UI and jQuery.

As for the overall UI, I made use of Vue.js, again for the same reason of comfort level and experience. I got familiar with Vue.js from its use for more than year and did stick to it. I like the way data are bound to UI components together with the methods of the component system. The event bus is also a plus for me in terms of having components communicate with each other while having the ability to obscure some of the underlying data withi each component.

Furthermore, I built a temporary local server for the development and testing of the project. For this, I made used of Node.js Express to serve my static files and modules.

### Disclaimer

This is a portfolio project and as such, it is not meant to be used nor be taken as professional design aid nor advice in any way. While it is available for public use, the end-user shall be responsible for checking the results given by the app. Any error of commission or ommission resulting from the use of the app shall not, under any circumstance, make the author liable.
