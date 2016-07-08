#!/bin/bash

#
# Update setup
#
runonce_update() {

    notify title "UPDATE: Initialize container settings ... "

    # Fixing working directory permissions
    lcs-rt --fix-perm update

    # Determine new install or restoring
    if [[ ${LCS_NEW_INSTALL} == true ]]; then
        # initial envs from user inputs and defaults
        lcs-rt --envs update && source ${ENVS_FILE}

        # custom code after envs initialized
    else
        # custom code when restore
        notify success "Update restored."
    fi

    # Persist directories and files
    lcs-rt --persistence update

    notify title "UPDATE: Initialization completed."
}
