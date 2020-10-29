# [v.0.11.0](https://github.com/upb-uc4/ui-web/compare/v0.10.0...v0.11.0) (2020-10-29)

## Bugfix
- incrementing and decrementing the participation limit with arrow keys or the arrows provided by the browser for number fields, will be registered as changes made to the course and make it saveable [#590](https://github.com/upb-uc4/ui-web/issues/590)
- adjust mobile design of the course view
- adjust mobile design of the account list for admins

## Dependencies
- remove npm package "vue-cli-plugin-vue-next" as it is no longer needed with the official release of Vue3 [#592](https://github.com/upb-uc4/ui-web/issues/592)

## Refactoring
- Replace placeholder icons in navbars with proper fa icons [#621](https://github.com/upb-uc4/ui-web/issues/621)

# [v.0.10.0](https://github.com/upb-uc4/ui-web/compare/v0.9.1...v0.10.0) (2020-10-09)

## Bugfix
- adjust mobile design of "create account" page for admins
- close mobile burger menu on navigation to another page [#552](https://github.com/upb-uc4/ui-web/issues/552)
- correct ratio of navbar profile picture and update it on user change [#561](https://github.com/upb-uc4/ui-web/pull/561)
- enable opening new tabs via navbar menu items [#575](https://github.com/upb-uc4/ui-web/pull/575)
- replace placeholder texts in the section descriptions [#559](https://github.com/upb-uc4/ui-web/issues/559)

# [v.0.9.1](https://github.com/upb-uc4/ui-web/compare/v0.9.0-hotfix.1...v0.9.1) (2020-10-02)

## Feature
- add profile picture functionality (set, update, delete) for admins and users [#551](https://github.com/upb-uc4/ui-web/pull/551)

## Bugfix
- remove stubs from the student's desktop navigation [#537](https://github.com/upb-uc4/ui-web/pull/537)
- error feedback is given on posting an account without role [#535](https://github.com/upb-uc4/ui-web/issues/535)

# [v.0.9.0-hotfix.1](https://github.com/upb-uc4/ui-web/compare/v0.9.0...v0.9.0-hotfix.1) (2020-09-28)

## Bugfix
- enable error display for adding matriculation data [#543](https://github.com/upb-uc4/ui-web/pull/543)

# [v.0.9.0](https://github.com/upb-uc4/ui-web/compare/v0.8.1...v0.9.0) (2020-09-28)

## Feature
- add test data cleanup on server after test fails cause them to not be deleted [#522](https://github.com/upb-uc4/ui-web/pull/522)
- speed up tests by removing cypress procedures that were used for creating test objects [#523](https://github.com/upb-uc4/ui-web/pull/523)

## Bugfix
- rework clickable areas in all mobile menus [#513](https://github.com/upb-uc4/ui-web/pull/513)
- fix mobile presentation of matriculation settings in account page [#507](https://github.com/upb-uc4/ui-web/issues/507)


# [v.0.8.1](https://github.com/upb-uc4/ui-web/compare/v0.8.0...v0.8.1) (2020-09-22)

## Feature
- allow adding multiple FoSs at once when updating matriculation data [#466](https://github.com/upb-uc4/ui-web/pull/466)
- improve the performance of our website (by a lot!) [#452](https://github.com/upb-uc4/ui-web/pull/452)
- JWT authentication [#437](https://github.com/upb-uc4/ui-web/pull/437)
- create logo and add it to website and application [#479](https://github.com/upb-uc4/ui-web/pull/479) (Website: [#15](https://github.com/upb-uc4/website/pull/15))
- add E2E tests for matriculation management [#505](https://github.com/upb-uc4/ui-web/pull/505)

# [v.0.8.0](https://github.com/upb-uc4/ui-web/compare/v0.7.0...v0.8.0) (2020-09-14)

## Feature
- add course management functionality for administrators [#441](https://github.com/upb-uc4/ui-web/pull/441)
- add e2e tests for many features
- scrolling up to the top most error in a form [#445](https://github.com/upb-uc4/ui-web/pull/445)

## Bugfix
- rework clickable areas in all desktop menus [#429](https://github.com/upb-uc4/ui-web/pull/429)
- no error shown for conflicting usernames [#445](https://github.com/upb-uc4/ui-web/pull/445

# [v.0.7.0](https://github.com/upb-uc4/ui-web/compare/v0.6.0...v0.6.1) (2020-08-31)
## Feature
- add support for mobile navigation [#390](https://github.com/upb-uc4/ui-web/pull/390)
- add error feedback for updating profile information via the private profile page [#402](https://github.com/upb-uc4/ui-web/pull/402)
- add a course list for the lecturer containing all lectures [#376](https://github.com/upb-uc4/ui-web/pull/376)
- add immatriculation components [##368](https://github.com/upb-uc4/ui-web/pull/368)
    - add component containing the immatriculation history
    - add latest immatriculation fields to account form and student's private profile
    - add modal for showing the immatriculation history to the student in private profile
- change in immatriculation component within the account form will trigger unsaved changes modal on leave [#391](https://github.com/upb-uc4/ui-web/pull/391)
- add phone number to user object and account form

## Refactor
- randomize test data to allow for concurrent testing [#353](https://github.com/upb-uc4/ui-web/pull/353)
- reorganize src folder structure [#418](https://github.com/upb-uc4/ui-web/pull/418)

## Bugfix
- add a timeout of 100ms to prevent refreshing the page too fast (caused application to crash) [#358](https://github.com/upb-uc4/ui-web/pull/358)
- make a deep copy of address prop in profile address section to avoid directly changing the prop [#381](https://github.com/upb-uc4/ui-web/pull/381)
- fixes a bug that caused the application to crash if you want to view your own courses without having one
- add house number to private profile [#398](https://github.com/upb-uc4/ui-web/pull/398)
- prevent user from reaching the login page if already logged in [#406](https://github.com/upb-uc4/ui-web/pull/406)

# [v.0.6.0](https://github.com/upb-uc4/ui-web/compare/v0.5.1...v0.6.0) (2020-08-17)
## Feature
- add filtering by role for the admin account list [#302](https://github.com/upb-uc4/ui-web/pull/302)
- add about page containing information of our software, team and currently running versions [#322](https://github.com/upb-uc4/ui-web/pull/322)
- add filtering by course type for course lists of lecturer and student [#313](https://github.com/upb-uc4/ui-web/pull/313)
- add e2e tests using cypress (#218)
- add workflow for automatic unit testing and e2e testing (#218)
- add code coverage reporting [#323](https://github.com/upb-uc4/ui-web/pull/323)
- add simple search function for the search bars above account/course lists [#347](https://github.com/upb-uc4/ui-web/pull/347)
- add user serivce API 0.5.2 [#352](https://github.com/upb-uc4/ui-web/pull/352)
- increase performance of course rendering [#352](https://github.com/upb-uc4/ui-web/pull/352)

## Refactor
- restyle versions [#298](https://github.com/upb-uc4/ui-web/pull/298)
- unify usage of v-models and emits in codebase [#305](https://github.com/upb-uc4/ui-web/pull/305)
- increase performance of course loading [#317](https://github.com/upb-uc4/ui-web/pull/317)
- move course filtering for lecturer from frontend to backend [#317](https://github.com/upb-uc4/ui-web/pull/317)
- remove unused wrapper components for asynchronous data loading [#341](https://github.com/upb-uc4/ui-web/pull/341)
- replace placeholder descriptions in edit/create course form
- center loading spinner in course/account forms [#408](https://github.com/upb-uc4/ui-web/pull/408)

## Bugfix
- Fix a possible XSS vulnerability [#141](https://github.com/upb-uc4/ui-web/issues/141)
- Fix cursor styling of menus [#301](https://github.com/upb-uc4/ui-web/issues/301)
- Fix a bug that made menus close on smaller screen sizes [#306](https://github.com/upb-uc4/ui-web/issues/306)
- Fix a bug that strings were emitted for the participant limit of a course and the semester count in account form, but expected was a number [#348](https://github.com/upb-uc4/ui-web/issues/348)


# [v.0.5.1](https://github.com/upb-uc4/ui-web/compare/v0.5.0...v0.5.1) (2020-08-03)
## Refactor
- Move Password change API endpoint [#293](https://github.com/upb-uc4/ui-web/pull/293)
- 
## Bug Fixes
- fix lecturers not seeing their own courses
- fix missing route enter restrictions of settings page [#294](https://github.com/upb-uc4/ui-web/pull/294)

## Feature
- add routing to landing page behind logo in navbar [#296](https://github.com/upb-uc4/ui-web/pull/296)

# [v.0.5.0](https://github.com/upb-uc4/ui-web/compare/v0.4.5-hotfix.1...v0.5.0) (2020-07-31)

## Feature
- add api version endpoints (#249) (just api calls, no vue)
- add welcome landing page showing all version numbers of services [#271](https://github.com/upb-uc4/ui-web/pull/271)

## Bug Fixes
- User was not able to update his password, because the confirmation modal used an older version of the API and the store (#272)

## Refactor
- change input type of semester count in student's profile to text (removes buttons for increasing and decreasing)

### Usability

# [v.0.4.5-hotfix.1](https://github.com/upb-uc4/ui-web/compare/v0.4.5...v0.4.5-hotfix.1) (2020-07-30)
## Bug Fixes
- User was not able to update his password, because the confirmation modal used an older version of the API and the store (#272)

# [v.0.4.5](https://github.com/upb-uc4/ui-web/compare/v0.4.4...v0.4.5) (2020-07-30)

## Feature
- Add password change API + unit test (#213)
- adds errors for nested objects, like the street of one's address (#233)
- Add option for user to change the password (#208)
- Redesign admin account list to have a more modern look [#226](https://github.com/upb-uc4/ui-web/pull/226)
- Allow re-authentication on page reload (#248)
- Add settings page [#250](https://github.com/upb-uc4/ui-web/pull/250)
- Add private profile page for admin (#252)
- add new navbar and navigation [#265](https://github.com/upb-uc4/ui-web/pull/265)
- 
## Bug Fixes
- prevent user from editing personal information (#259)

## Refactor
- extract searchbar component for better adaptability (#131)
- extract sections from account form in single components (#238)
- bundle birthdate logic in birthdate picker component and remove the old birthdate object within the account (#241)

### Usability
- rework login error validation (#232)

## Dependencies
- - added cypress version 4.10.0

# [v.0.4.4](https://github.com/upb-uc4/ui-web/compare/v0.4.3...v0.4.4) (2020-07-22)

- Requires backend version 0.4.2

## Bug Fixes

### Usability
- change input type of semester count in student's private profile to text (#118)
- add proper page titling based on route (#195)
- change type of lecturer name in course components to button, which routes to lecturer's public profile (#215, #222)
- display the full name of the lecturer in course components (#217)
- Add a new "Add" button next to the search bar in the account/course lists for usability (#178)
- Change type of lecturer name in student's courses to button, which routes to lecturer's public profile (#115)

### Technical
- Declare emits in various components (adds type safety to emit)
- Add view wide unique id attributes to all user interaction HTML elements
- Refactor CreateEditCourse (split into components) 
- Fix ambiguous routes bug (#224)

## Dependencies
- Updated @fortawesome/fontawesome-free from 5.13.0 to 5.14.0
- Updated @vue/cli from 4.4.1 to 4.4.6
- Updated tailwindcss from 1.4.6 to 1.5.1
- Updated vue from 3.0.0-beta.18 to 3.0.0-rc.2
- Updated vuex from 4.0.0-beta.2 to 4.0.0-beta.4
- Updated @types/jest from 26.0.4 to 26.0.5
- Updated @vue/cli-plugin-babel from 4.4.0 to 4.4.6
- Updated @vue/cli-plugin-eslint from 4.4.0 to 4.4.6
- Updated @vue/cli-plugin-typescript from 4.4.1 to 4.4.6
- Updated @vue/cli-plugin-unit-jest from 4.4.1 to 4.4.6
- Updated @vue/clie-service from 4.4.0 to 4.4.6
- Updated @vue/compiler-sfc from 3.0.0-beta.1 to 3.0.0-rc.2
- Updated eslint-plugin-vue from 7.0.0-alpha.0 to 7.0.0-beta.0
- Updated typescript from 3.9.3 to 3.9.7
- Updated lodash from 4.17.15 to 4.17.19

# [v0.4.3](https://github.com/upb-uc4/ui-web/compare/v0.4.2...v0.4.3) (2020-07-19)

## Bug Fixes

### Usability
- Fix lecturer not being able to edit a course (#187)
- Fix course accounts not displaying backend validation (a1198f2)
  
### Technical
- Remove linter warnings (#189)

# [v0.4.2](https://github.com/upb-uc4/ui-web/compare/v0.4.1...v0.4.2) (2020-07-18)
## Bug Fixes
### Usability
- Remove backend validation alerts that are no longer needed (ce50c42)
- Fix course cards not being responsive for mobile devices (#179)

### Technical
- Refactor Error Handling (#180)
- Rework pre-commit hook to only lint staged files to reduce runtime (e86a8e3)
- Remove frontend validation (4060e0e4)

# [v0.4.1](https://github.com/upb-uc4/ui-web/compare/v0.4.0...v0.4.1) (2020-07-17)
## Bug Fixes
### Usability
- Fix frontend validation error that made it impossible to create or edit Courses in some cases (#175)
  
# [v0.4.0](https://github.com/upb-uc4/ui-web/compare/v0.3.0...v0.4.0) (2020-07-17)
## Features
- Add auto formatting and linting to our repository (#139)
- Add deployment using docker (#149)
- Add new birthdate chooser to account creation (#167)
- Add new styling for backend validation errors (#171)
- Add new styling to icon buttons and input forms (#133)
- Add loading screen to edit forms (#142)
- Add public and private profiles (#143,)
- Add 404 error page to invalid routes (#137)
- Add backend validation to all forms (#128)
- Add refresh buttons to all lists (#129)
## Hotfixes
- Fix login routing for administrators routing to account creation instead of the account list (#112)
- Fix a bug where no validation was shown at all (#119)
- Fix a bug where field of study selection did not work (#114)
## Bug Fixes
### Usability
- Fix a bug where the birthDate on accounts would not be shown (#148)
### Technical
- Rework multiselect for fields of study to be more robust and reusable (#127)


# [v0.3.1](https://github.com/upb-uc4/ui-web/compare/v0.3.0...v0.3.1) (2020-07-06)
Please refer to the source code and helpful commit messages, as well as pull requests for more detail on changes in the first few versions.

# [v0.3.0](https://github.com/upb-uc4/ui-web/compare/v0.2.1...v0.3.0) (2020-07-03)
Please refer to the source code and helpful commit messages, as well as pull requests for more detail on changes in the first few versions.

# [v0.2.1](https://github.com/upb-uc4/ui-web/compare/0.2.0...v0.2.1) (2020-06-29)
Please refer to the source code and helpful commit messages, as well as pull requests for more detail on changes in the first few versions.

# [v0.2.0](https://github.com/upb-uc4/ui-web/compare/0.1.0...v0.2.0) (2020-06-19)
Please refer to the source code and helpful commit messages, as well as pull requests for more detail on changes in the first few versions.

# v0.1.0 (2020-06-08)
Please refer to the source code and helpful commit messages, as well as pull requests for more detail on changes in the first few versions.
