# [v.0.4.5](https://github.com/upb-uc4/ui-web/compare/v0.4.3...v0.4.5) (2020-07-29)

## Feature
- Add password change API + unit test (#213)
- adds errors for nested objects, like the street of one's address (#233)
- Add option for user to change the password (atm. in lecturer private profile, will be moved to a settings page) (#208)
- Redesign admin account list to have a more modern look [#226](https://github.com/upb-uc4/ui-web/pull/226)
- Allow re-authentication on page reload (#248)
- Add settings page [#250](https://github.com/upb-uc4/ui-web/pull/250)
- Add private profile page for admin (#252)

## Bug Fixes

## Refactor
- extract searchbar component for better adaptability (#131)
- extract sections from account form in single components (#238)
- bundle birthdate logic in birthdate picker component and remove the old birthdate object within the account (#241)

### Usability
- rework login error validation (#232)

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
