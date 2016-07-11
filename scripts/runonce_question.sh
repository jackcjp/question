#!/bin/bash

#
# Question setup
#
runonce_question() {

    notify title "QUESTION: Initialize container settings ... "

    # Fixing working directory permissions
    lcs-rt --fix-perm question

    # Determine new install or restoring
    if [[ ${LCS_NEW_INSTALL} == true ]]; then
        # initial envs from user inputs and defaults
        lcs-rt --envs question && source ${ENVS_FILE}

        # custom code after envs initialized
    else
        # custom code when restore
        notify success "Question restored."
    fi

    # Persist directories and files
    lcs-rt --persistence question

    notify title "QUESTION: Initialization completed."
}
