#!/bin/bash

NANOPAY_HOME=
NANOPAY_ROOT=/opt/nanopay
NANOPAY_TARBALL=
NANOPAY_REMOTE_OUTPUT=/tmp/tar_extract
NANOPAY_SERVICE_FILE=/lib/systemd/system/nanopay.service
MNT_HOME=/mnt/nanopay
LOG_HOME=/mnt/nanopay/logs
JOURNAL_HOME=/mnt/nanopay/journals

function quit {
    echo "ERROR :: Remote Install Failed"
    exit 1
}

function usage {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options are:"
    echo "  -h                  : Print usage information."
    echo "  -I <path>           : Remote location of tarball"
    echo "  -N <nanopay_home>   : Remote Nanopay home directory, can't be /opt/nanopay"
    echo "  -O <path>           : Remote directory tarball is extracted to, default to ~/tar_extract"
    echo ""
}

while getopts "hN:O:I:" opt ; do
    case $opt in
        h) usage; exit 0;;
        I) NANOPAY_TARBALL=$OPTARG;;
        N) NANOPAY_HOME=$OPTARG;;
        O) NANOPAY_REMOTE_OUTPUT=$OPTARG;;
        ?) usage; exit 0;;
   esac
done

NANOPAY_CURRENT_VERSION=$(readlink -f ${NANOPAY_ROOT} | awk -F- '{print $NF}')
NANOPAY_NEW_VERSION=$(echo ${NANOPAY_HOME} | awk -F- '{print $NF}')

function installFiles {
    if [ -z $NANOPAY_HOME ]; then
        echo "ERROR :: NANOPAY_HOME is undefined"
        quit
    fi

    # Move same/duplicate version installation.
    if [ -d $NANOPAY_HOME ]; then
        NANOPAY_BACKUP=${NANOPAY_HOME}.bak.tar.gz
        if [ -f ${NANOPAY_BACKUP} ]; then
            echo "INFO :: ${NANOPAY_BACKUP} found, deleting"
            rm -f ${NANOPAY_BACKUP}
        fi
        echo "INFO :: ${NANOPAY_HOME} found, backing up to ${NANOPAY_BACKUP}"
        tar -czf ${NANOPAY_BACKUP} --absolute-names ${NANOPAY_HOME}
        rm -rf ${NANOPAY_HOME}
    fi

    echo "INFO :: Installing nanopay to ${NANOPAY_HOME}"

    if [ ! -d $NANOPAY_HOME ]; then
        mkdir -p ${NANOPAY_HOME}
    fi
    chgrp nanopay $NANOPAY_HOME

    if [ ! -d ${NANOPAY_HOME}/lib ]; then
        mkdir -p ${NANOPAY_HOME}/lib
    fi
    chgrp nanopay ${NANOPAY_HOME}/lib
    chmod 750 ${NANOPAY_HOME}/lib

    cp -r ${NANOPAY_REMOTE_OUTPUT}/lib/* ${NANOPAY_HOME}/lib

    if [ ! -d ${NANOPAY_HOME}/bin ]; then
        mkdir -p ${NANOPAY_HOME}/bin
    fi
    chgrp nanopay ${NANOPAY_HOME}/bin
    chmod 750 ${NANOPAY_HOME}/bin

    cp -r ${NANOPAY_REMOTE_OUTPUT}/bin/* ${NANOPAY_HOME}/bin

    if [ ! -d ${NANOPAY_HOME}/etc ]; then
        mkdir -p ${NANOPAY_HOME}/etc
    fi
    cp -r ${NANOPAY_REMOTE_OUTPUT}/etc/* ${NANOPAY_HOME}/etc
    chgrp nanopay ${NANOPAY_HOME}/etc
    chmod -R 750 ${NANOPAY_HOME}/etc

    if [ ! -d ${MNT_HOME} ]; then
        mkdir -p ${MNT_HOME}
    fi
    chgrp nanopay ${MNT_HOME}
    chmod 770 ${MNT_HOME}

    if [ ! -d ${LOG_HOME} ]; then
        mkdir -p ${LOG_HOME}
    fi
    chgrp nanopay ${LOG_HOME}
    chmod 770 ${LOG_HOME}

    if [ ! -d ${JOURNAL_HOME} ]; then
        mkdir ${JOURNAL_HOME}
    fi
    mkdir -p ${JOURNAL_HOME}/sha256
    mkdir -p ${JOURNAL_HOME}/migrated

    chgrp -R nanopay ${JOURNAL_HOME}
    chmod 770 ${JOURNAL_HOME}
    chmod -R 760 ${JOURNAL_HOME}/*
    chmod 770 ${JOURNAL_HOME}/sha256
    chmod 770 ${JOURNAL_HOME}/migrated

}

function setupUser {
    echo "INFO :: Setting file permissions"

    id -u nanopay > /dev/null
    if [ ! $? -eq 0 ]; then
        echo "INFO :: User nanopay not found, creating user nanopay"
        groupadd --force --gid 6266 nanopay
        useradd -g nanopay --uid 6266 -m -s /bin/false nanopay
        usermod -L nanopay
    fi

    # test and set umask
    USER_HOME="$(grep nanopay /etc/passwd | cut -d':' -f6)"
    BASHRC="$USER_HOME/.bashrc"
    if [ ! -f "$BASHRC" ]; then
        touch "$BASHRC"
    fi
    if grep -Fxq "umask" "$BASHRC"; then
        sed -i 's/umask.*/umask 027/' "$BASHRC"
    else
       echo "umask 027" >> "$BASHRC"
    fi
}

function setupNanopaySymLink {
    if [ -h ${NANOPAY_ROOT} ]; then
        unlink ${NANOPAY_ROOT}
    elif [ -d ${NANOPAY_ROOT} ]; then
        BACKUP_DIR="${NANOPAY_ROOT}.$(date +%s).bak"
        echo "INFO :: Found old ${NANOPAY_ROOR} dir, moving to ${BACKUP_DIR}"
        mv ${NANOPAY_ROOT} ${BACKUP_DIR}
    fi

    ln -s ${NANOPAY_HOME} ${NANOPAY_ROOT}

    # symlink to journals
    if [ -h ${NANOPAY_HOME}/journals ]; then
        unlink ${NANOPAY_HOME}/journals
    fi

    if [ -d ${JOURNAL_HOME} ]; then
        ln -s ${JOURNAL_HOME} ${NANOPAY_HOME}/journals
    fi

    # symlink to logs
    if [ -h ${NANOPAY_HOME}/logs ]; then
        unlink ${NANOPAY_HOME}/logs
    fi

    if [ -d ${LOG_HOME} ]; then
        ln -s ${LOG_HOME} ${NANOPAY_HOME}/logs
    fi
}

function setupSystemd {
    systemctl list-units | grep nanopay.service &> /dev/null
    if [ $? -eq 0 ]; then
        sudo systemctl stop nanopay
        sudo systemctl disable nanopay
    fi

    if [ ! -h ${NANOPAY_SERVICE_FILE} ]; then
        sudo ln -s ${NANOPAY_ROOT}/etc/nanopay.service ${NANOPAY_SERVICE_FILE}
    fi

    sudo systemctl daemon-reload
    sudo systemctl enable nanopay
    sudo systemctl start nanopay
}

echo "INFO :: Installing nanopay on remote server"

if [ ! -f ${NANOPAY_TARBALL} ]; then
    echo "ERROR :: Tarball ${NANOPAY_TARBALL} doesn't exist on remote server"
    quit
fi

if [ -d ${NANOPAY_REMOTE_OUTPUT} ]; then
    rm -rf ${NANOPAY_REMOTE_OUTPUT}
fi

mkdir -p ${NANOPAY_REMOTE_OUTPUT}

echo "INFO :: Extracting tarball ${NANOPAY_TARBALL}"

tar -xzf ${NANOPAY_TARBALL} -C ${NANOPAY_REMOTE_OUTPUT}

if [ ! $? -eq 0 ]; then
    echo "ERROR :: Extracting tarball failed"
    quit
fi

setupUser

installFiles

setupNanopaySymLink

setupSystemd

exit 0
