# Release checklist

## Before creating a tag

- [ ] `npm run quality` passes locally.
- [ ] The version and release notes have been reviewed.
- [ ] No sensitive values are present in source, diagnostics, or build output.
- [ ] API contract, account-security, and QA notes have been reviewed for any changed behavior.

## Repository controls

- [ ] Protect the default branch and require the **Quality gate / Verify quality gate** check before merge.
- [ ] Limit creation of `v*` tags to release maintainers.
- [ ] Require the relevant reviewer approvals before merging changes that affect authentication, authorization, or release workflows.

## Candidate release

1. Create a signed version tag following `vMAJOR.MINOR.PATCH`.
2. Confirm the **Release verification** workflow succeeds.
3. Download and smoke-test its `kotodama-web-<tag>` artifact in the intended environment.
4. Create/publish a release only after the smoke test and required approvals are complete.

The repository workflow intentionally does not deploy or publish a GitHub Release automatically. Production credentials and deployment remain outside source control.
