---------------------------------------------
Remove this, if this PR is not to main!

<b>Version to release: v0.7.0</b>

## Merging this pull request will automatically:
- create a tag using the version in our package.json
- publish a release using this tag, referencing the CHANGELOG.md
- publish the release on dockerhub using the version of our package.json

## Please fill out the following checklist:
- [ ] The version of the package.json is different to every other tag in this repository
- [ ] The CHANGELOG.md contains all changes (bugfixes, features, dependency updates, ...) for this release
----------------------------

# Description

Fixes issue #XXX (delete if no issue)
Implements issue #XXX (delete if no issue)

## Reason for this PR
- [INSERT REASONS HERE]

## Changes in this PR
- [INSERT CHANGES HERE]

### Dependency update
- List all new dependencies (delete if no additions)

## Type of change (remove all that don't apply)
- Refactoring
- Bug fix (non-breaking change which fixes an issue)
- Hotfix
- New feature (non-breaking change which adds functionality)
- Testing
- Breaking change (fix or feature that would cause existing functionality to not work as expected)
- This change requires a documentation update (README, e.g. deployment changes)
  - I added the documentation
# How Has This Been Tested?

Please describe the tests that you ran to verify your changes. Provide instructions so we can reproduce. Please also list any relevant details for your test configuration

- [ ] Manually tested all use cases this could alter

**Test Configuration**:
- OS: Windows Mac Linux
- Browser: Firefox Chrome Safari Chromium

- Frontend: (remove all that don't apply)
  - [ ] Development build
  - [ ] Production build
  - [ ] Dockerized production build
- Backend: (remove all that don't apply)
  - [ ] No backend needed to test this
  - [ ] deployed production build
  - [ ] deployed development build
  - [ ] deployed experimental build
  - [ ] Local build (commit hash [XXXXXXX])

# Checklist: (remove all that don't apply)

- [ ] I added corresponding E2E tests (especially for bugfixes)
- [ ] I added corresponding unit tests (if API code)
- [ ] I have performed a self-review of my own code
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new linting warnings or console warnings
- [ ] I have updated the package.json version if this is a new release candidate (remove is it is not)
- [ ] I have updated the CHANGELOG.md to include any changes made in this PR (add WIP to the top, if there is none already)