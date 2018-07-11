# Concatenate JDAO files from subdirectories into one JDAO

IN_DIR=$1
OUT_DIR=$2
if [ -d "$IN_DIR " ]; then
    cd $IN_DIR
fi

if [ ! -d "$OUT_DIR" ]; then
    OUT_DIR=target/journals
fi
mkdir -p "$OUT_DIR"

MODE=1
INSTANCE=1
VERSION=1

# Sets varuables to lowercase
MODE=$(echo "$MODE" | tr '[:upper:]' '[:lower:]')
INSTANCE=$(echo "$INSTANCE" | tr '[:upper:]' '[:lower:]')
VERSION=$(echo "$VERSION" | tr '[:upper:]' '[:lower:]')

# Creates an array of the file names 
declare -a arr=( 
  "branches"
  "brokers"
  "businessSectors"
  "businessTypes"
  "corridors"
  "countries"
  "cronjobs"
  "currencies"
  "dugs"
  "emailTemplates"
  "exportDriverRegistrys"
  "fundTransferSystems"
  "groups"
  "htmlDoc"
  "institutions"
  "institutionPurposeCodes"
  "languages"
  "menus"
  "payoutOptions"
  "permissions"
  "questionnaires"
  "regions"
  "scripts"
  "services"
  "spids"
  "tests"
  "transactionLimits"
  "transactionPurposes"
  "txnProcessors"
  "users"
  )

# Go through the array and check each location for the file and concatenate into one JDAO
# create journals file used by build.sh
# FIXME: this printf is generating two files, one at OUT_DIR/journals, but another in the current directory.
printf "%s\n" "${arr[@]}" > "$OUT_DIR"/journals

for file in "${arr[@]}"
do
  journal_file="$file".0

  # Emptys the file
  > "$OUT_DIR/$journal_file"

  # Checks if file exists, if so grabs the file from there
  if  [[ -f "foam2/src/$file" ]]; then
      cat foam2/src/$file >> "$OUT_DIR/$journal_file"
  fi
  if  [[ -f "nanopay/src/$file" ]]; then
      cat nanopay/src/$file >> "$OUT_DIR/$journal_file"
  fi
  if  [[ -f "interac/src/$file" ]]; then
      cat interac/src/$file >> "$OUT_DIR/$journal_file"
  fi
  if  [[ -f "deployment/$file" ]]; then
      cat deployment/$file >> "$OUT_DIR/$journal_file"
  fi
  if  [[ -f "deployment/$MODE/$file" ]]; then
      cat deployment/$MODE/$file >> "$OUT_DIR/$journal_file"
  fi
  if  [[ -f "deployment/$MODE/$INSTANCE/$file" ]]; then
      cat deployment/$MODE/$INSTANCE/$file >> "$OUT_DIR/$journal_file"
  fi
  if  [[ -f "deployment/$MODE/$VERSION/$file" ]]; then
      cat deployment/$MODE/$VERSION/$file >> "$OUT_DIR/$journal_file"
  fi
  if  [[ -f "deployment/$MODE/$INSTANCE/$VERSION/$file" ]]; then
      cat deployment/$MODE/$INSTANCE/$VERSION/$file >> "$OUT_DIR/$journal_file"
  fi

  # .jnl files - transition
  if  [[ -f "foam2/src/${file}.jnl" ]]; then
      cat "foam2/src/${file}.jnl" >> "$OUT_DIR/$journal_file"
  fi
  if  [[ -f "nanopay/src/${file}.jnl" ]]; then
      cat "nanopay/src/${file}.jnl" >> "$OUT_DIR/$journal_file"
  fi
  if  [[ -f "interac/src/${file}.jnl" ]]; then
      cat "interac/src/${file}.jnl" >> "$OUT_DIR/$journal_file"
  fi
  if  [[ -f "deployment/${file}.jnl" ]]; then
      cat "deployment/${file}.jnl" >> "$OUT_DIR/$journal_file"
  fi
  if  [[ -f "deployment/$MODE/${file}.jnl" ]]; then
      cat "deployment/$MODE/${file}.jnl" >> "$OUT_DIR/$journal_file"
  fi
  if  [[ -f "deployment/$MODE/$INSTANCE/${file}.jnl" ]]; then
      cat "deployment/$MODE/$INSTANCE/${file}.jnl" >> "$OUT_DIR/$journal_file"
  fi
  if  [[ -f "deployment/$MODE/$VERSION/${file}.jnl" ]]; then
      cat "deployment/$MODE/$VERSION/${file}.jnl" >> "$OUT_DIR/$journal_file"
  fi
  if  [[ -f "deployment/$MODE/$INSTANCE/$VERSION/${file}.jnl" ]]; then
      cat "deployment/$MODE/$INSTANCE/$VERSION/${file}.jnl" >> "$OUT_DIR/$journal_file"
  fi

done

exit 0
