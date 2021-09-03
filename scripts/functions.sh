#!/usr/local/bin/bash

pbpaste=$(pbpaste && echo) 

_systype=$(uname)
case "$_system" in 
  Darwin)
    export AWK=/usr/local/bin/gawk
    export BASENAME=/usr/local/bin/gbasename
    export DATE=/usr/local/bin/gdate
    export DIRNAME=/usr/local/bin/gdirname
    export FIND=/usr/local/bin/gfind
    export GIT=/usr/local/bin/git
    export GUNZIP=/usr/bin/gunzip
    export GZIP=/usr/bin/gzip
    export MKTEMP=/usr/local/bin/gmktemp
    export PERL=/usr/local/bin/perl
    export PG_DUMP=/usr/local/bin/pg_dump
    export PSQL=/usr/local/bin/psql
    export READLINK=/usr/local/bin/greadlink
    export SED=/usr/local/bin/gsed
    export ECHO=/usr/local/bin/gecho
    export PRINTF=/usr/local/bin/gprintf
    export WHICH=/usr/local/bin/gwhich
    export CURL=/usr/bin/curl
    export REALPATH=/usr/local/bin/grealpath
    export STAT=/usr/local/bin/gstat
    export GREP=/usr/local/bin/ggrep
    export EGREP=/usr/local/bin/gegrep
    export PGREP=/usr/local/bin/ggrep\ -P
    export TOUCH=/usr/local/bin/gtouch ;;

  Linux)
    export AWK=$(which gawk || which awk)
    export BASENAME=$(which basename)
    export DATE=$(which date)
    export DIRNAME=$(which dirname)
    export FIND=$(which find)
    export GIT=$(which git)
    export GUNZIP=$(which gunzip)
    export GZIP=$(which gzip)
    export MKTEMP=$(which mktemp)
    export PERL=$(which perl)
    export PG_DUMP=$(which pg_dump)
    export PSQL=$(which psql)
    export READLINK=$(which readlink)
    export SED=$(which sed)
    export ECHO=$(which echo)
    export PRINTF=$(which printf)
    export WHICH=$(which which)
    export curl=$(which curl)
    export REALPATH=$(which realpath)
    export STAT=$(which stat)
    export GREP=$(which grep)
    export EGREP=$(which egrep)
    export PGREP="$(which grep) -P"
    export TOUCH=$(which touch) ;;

    esac 
export commands=( AWK BASENAME DATE DIRNAME FIND GIT GUNZIP GZIP \
  MKTEMP PERL PG_DUMP PSQL READLINK SED ECHO PRINTF WHICH CURL \
  STAT REALPATH TOUCH )


get_date_struct() {
  usage=$'Use like this: > declare -A datestruct="$(eval "$(get_date_struct 02/02/21)")"'
  if [[ "z$1" == "z" ]]; then
    $PRINTF "%s\n\n" "$usage"
    return
  fi
  declare -a parts
  parts=( $( echo "$1" | sed -e 's/\//\n/g' ) )
  if [[ ${#parts} -gt 2 ]]; then
    # we have a range: TODO
    $PRINTF "%s\n" "An error occured" > /dev/stderr
    exit 1
  elif [[ ${#parts} == 2 ]]; then 
    year="$( echo "20${parts[2]}" | $PERL -p -e  's/^.*(....)$/\1/g' )"
    month="$( echo "0${parts[0]}" | $PERL -p -e 's/^.*(..)$/\1/g' )"
    day="$(echo "0${parts[1]}" | $PERL -p -e 's/^.*(..)$/\1/g' )"
  elif [[ ${#parts} == 1 ]]; then
    year="$( echo "20${parts[1]}" | $PERL -p -e  's/^.*(....)$/\1/g' )"
    month="$( echo "0${parts[0]}" | $PERL -p -e 's/^.*(..)$/\1/g' )"
    day="-1"
  elif [[ ${#parts} == 0 ]]; then
    year="$( echo "20${parts[0]}" | $PERL -p -e  's/^.*(....)$/\1/g' )"
    month="-1"
    day="-1"
  fi
  declare -A dstruct
  dstruct[year]=$year
  dstruct[day]=$day
  dstruct[month]=$month
  typeset -A | grep dstruct | sed -e 's/^.*dstruct=//g'
}

lines_in_order() {
  declare -A d1
  declare -A d2
  line1="$(echo "$1" | $PERL -p -e 's/(^\W*[0-9\/\-]{4,20})( ?- ?[0-9\/\-]{4,20})?:?\W.*/\1\2/g')"
  $PRINTF "%s\n" "line1='$line1'"
  line2="$(echo "$2" | $PERL -p -e 's/(^\W*[0-9\/\-]{4,20})( ?- ?[0-9\/\-]{4,20})?:?\W.*/\1\2/g')"
  $PRINTF "%s\n" "line2='$line2'"
  eval "declare -A d1=$(get_date_struct "$line1" )"
  eval "declare -A d2=$(get_date_struct "$line2" )"
  if [[ ${d2[year]} -gt ${d1[year]} ]]; then
    $PRINTF "%s\n" 1
    # $PRINTF "%s $LINENO year greater\n" 1
  elif [[ ${d2[year]} -lt ${d1[year]} ]]; then 
    $PRINTF "%s\n" 0
    # $PRINTF "%s $LINENO year less \n" 0
  elif [[ ${d2[month]} -gt ${d1[year]} ]]; then
    $PRINTF "%s\n" 1
    # $PRINTF "%s $LINENO month greater\n" 1
  elif [[ ${d2[month]} -lt ${d1[year]} ]]; then 
    $PRINTF "%s\n" 0
    # $PRINTF "%s $LINENO month less \n" 0
  elif [[ ${d2[month]} -eq -1  ]] || [[  ${d1[month]} -eq -1 ]]; then
    $PRINTF "%s\n" 1
    # $PRINTF "%s $LINENO year equal, and no month comparison possible\n" 1
  elif [[ ${d2[day]} -gt ${d1[year]} ]]; then
    $PRINTF "%s\n" 1
    # $PRINTF "%s $LINENO day greater\n" 1
  elif [[ ${d2[day]} -lt ${d1[year]} ]]; then 
    $PRINTF "%s\n" 0
    # $PRINTF "%s $LINENO day less \n" 0
  elif [[ ${d2[day]} -eq -1  ]] || [[  ${d1[day]} -eq -1 ]]; then
    $PRINTF "%s\n" 1
    # $PRINTF "%s $LINENO year, month equal, and no day comparison possible\n" 1
  else
    $PRINTF "%s \n" "THIS SHOULDN'T HAPPEN"
  fi
}


check_date_sort () 
{ 
    f1=$($MKTEMP);
    f2=$($MKTEMP);
    pbpaste | $PGREP '^\d{1,2}\/\d{1,2}\/\d{2,4}' | grep -P -v '^\s*$' > $f1
    pbpaste | grep -P '^\d{2}\/\d{2}\/\d{4}' | grep -P -v '^\s*$' | sort -t '/' -k3,4g -k1,2g -k2,2g > $f2
    res=$(diff $f1 $f2 >/dev/null 2>&1; echo $?);
    if [[ $res > 0 ]]; then
       diff $f1 $f2;
    fi;
    return $res
}

check_date_sort2() {
  f1=$($MKTEMP);
  f2=$($MKTEMP);
  pbpaste | grep -v '^\W+$' > $f1
  line1=$(head -n1 $f1)
  tail -n $(echo "$(wc -l $f1 | $AWK '{print $1}')-1" | bc ) $f1 > $f2
  mv $f2 $f1
  
  while IFS= read -r line2; do
    linesok=$(lines_in_order "$line1" "$line2")
    if [[ $linesok -eq 1 ]]; then
      echo "ok"
    else
      $PRINTF "%s\n\n" "ERROR, lines '$line1' and '$line2' are out of order" > /dev/stderr
      return 1
    fi
    line1="$line2"
  done < $f1

  $PRINTF "%s\n" "0"
}

add_textblock() {
  (pbpaste && echo -e "\n\n") >> $HOME/src/ro-tools/data/text_phrases.txt
}

