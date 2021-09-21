#!/usr/local/bin/bash

pbpaste=$(pbpaste && echo)

_systype=$(uname)
case "$_systype" in
Darwin* | darwin*)
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
	export TOUCH=/usr/local/bin/gtouch
	;;
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
	export CURL=$(which curl)
	export REALPATH=$(which realpath)
	export STAT=$(which stat)
	export GREP=$(which grep)
	export EGREP=$(which egrep)
	export PGREP="$(which grep) -P"
	export TOUCH=$(which touch)
	;;
*)
	echo "unknown system type '$_systype'"
	exit 1
	;;
esac
export commands=(AWK BASENAME DATE DIRNAME FIND GIT GUNZIP GZIP
	MKTEMP PERL PG_DUMP PSQL READLINK SED ECHO PRINTF WHICH CURL
	STAT REALPATH TOUCH)

get_date_struct() {
  # unset $(declare -A | $GREP dstruct |  perl -p -e 's/^.*declare -.{1,2} ([A-Za-z]*dstruct[A-Za-z]*).*/\1/g')
  # unset $(declare -A | $GREP d1 |  perl -p -e 's/^.*declare -.{1,2} ([A-Za-z]*d1[A-Za-z]*).*/\1/g')
  # unset $(declare -A | $GREP d2 |  perl -p -e 's/^.*declare -.{1,2} ([A-Za-z]*d2[A-Za-z]*).*/\1/g')
  usage=$'Use like this: > declare -A datestruct=$(eval "$(get_date_struct 02/02/21)")'
  if [[ "z$1" == "z" ]]; then
    $PRINTF "%s\n\n" "$usage" > /dev/stderr
    return 4
  fi
  declare -a parts
  parts=( $( echo "$1" | sed -e 's/\//\n/g' ) )
  if [[ ${#parts[@]} -gt 3 ]]; then
    # printf "%s\n\n" "\${#parts} = '${#parts[@]}'" > /dev/stderr
    # we have a range: TODO
    $PRINTF "%s\n" "An error occured" > /dev/stderr
    exit 1
  elif [[ ${#parts[@]} == 3 ]]; then 
    year="$( echo "20${parts[2]}" | $SED -e  's/^.*\(....\)$/\1/g' )"
    # month="$( echo "${parts[0]}" | $SED -e 's/^.*\(..\)$/\1/g' )"
    month="${parts[0]}"
    day="${parts[1]}"
  elif [[ ${#parts[@]} == 2 ]]; then
    year="$( echo "20${parts[1]}" | $SED -e  's/^.*\(....\)$/\1/g' )"
    month="${parts[0]}"
    day="-1"
  elif [[ ${#parts[@]} == 1 ]]; then
    year="$( echo "20${parts[0]}" | $SED -e  's/^.*\(....\)$/\1/g' )"
    month="-1"
    day="-1"
  fi
  declare -A dstruct
  dstruct[year]=$year
  dstruct[day]=$day
  dstruct[month]=$month
  typeset -A | $GREP dstruct | sed -e 's/^.*dstruct=//g'
  unset dstruct parts day year month
  return 0
}

lines_in_order() {
	unset line1 line2 d1 d2 dstruct parts
	line1="$(echo "$1" | $PERL -p -e 's/(^\W*[0-9\/\-]{4,20})( ?- ?[0-9\/\-]{4,20})?:\W.*/\1\2/g' | sed -e 's/:.*$//g')"
	line2="$(echo "$2" | $PERL -p -e 's/(^\W*[0-9\/\-]{4,20})( ?- ?[0-9\/\-]{4,20})?:\W.*/\1\2/g' | sed -e 's/:.*$//g')"
	eval declare -A d1="$(get_date_struct "$line1")"
	eval declare -A d2="$(get_date_struct "$line2")"
	# echo -e "d1='${d1[@]}' d2='${d2[@]}'\n\n" >/dev/stderr
	# typeset -A > /dev/stderr
	if [[ ${d2[year]} -gt ${d1[year]} ]]; then
		$PRINTF "%s\n" 0
		# echo 112  > /dev/stderr && typeset -A > /dev/stderr
	elif [[ ${d2[year]} -lt ${d1[year]} ]]; then
		$PRINTF "%s\n" 1
		# echo 115  > /dev/stderr && typeset -A
	else
		# Years are equal.  Must test for missing month first
		if [[ ${d2[month]} -eq -1 ]] || [[ ${d1[month]} -eq -1 ]]; then
			$PRINTF "%s\n" 0
			# echo 120 > /dev/stderr && typeset -A > /dev/stderr
		elif [[ ${d2[month]} -gt ${d1[month]} ]]; then
			$PRINTF "%s\n" 0
			# echo 123 > /dev/stderr && typeset -A > /dev/stderr
		elif [[ ${d2[month]} -lt ${d1[month]} ]]; then
			$PRINTF "%s\n" 1
			# echo 126 > /dev/stderr && typeset -A > /dev/stderr
		else
			# Years and months are equal.  Must test for missing day first
			if [[ ${d2[day]} -eq -1 ]] || [[ ${d1[day]} -eq -1 ]]; then
				$PRINTF "%s\n" 0
				# echo 131 > /dev/stderr && typeset -A > /dev/stderr
			elif [[ ${d2[day]} -gt ${d1[day]} ]]; then
				$PRINTF "%s\n" 0
				# echo 134 > /dev/stderr && typeset -A > /dev/stderr
			elif [[ ${d2[day]} -lt ${d1[day]} ]]; then
				$PRINTF "%s\n" 1
				# echo 137 > /dev/stderr && typeset -A > /dev/stderr
			else
				$PRINTF "%s\n" 1
				# echo 140 > /dev/stderr && typeset -A > /dev/stderr
			fi
		fi
	fi
}

check_date_sort.old() {
	f1=$($MKTEMP)
	f2=$($MKTEMP)
	pbpaste | $P$GREP '^\d{1,2}\/\d{1,2}\/\d{2,4}' | $GREP -P -v '^\s*$' >$f1
	pbpaste | $GREP -P '^\d{2}\/\d{2}\/\d{4}' | $GREP -P -v '^\s*$' | sort -t '/' -k3,4g -k1,2g -k2,2g >$f2
	res=$(
		diff $f1 $f2 >/dev/null 2>&1
		echo $?
	)
	if [[ $res -gt 0 ]]; then
		diff $f1 $f2
	fi
	return $res
}

check_date_sort() {
	f1=$($MKTEMP -t ro-tools.datecheck.tmpXXXXXX)
	f2=$($MKTEMP -t ro-tools.datecheck.tmpXXXXXX)
	if [[ "z$1" == "z" ]]; then
		pbpaste | $GREP -v '^\W*$' | $PERL -p -e 's/:.*$//g' >$f1
		_src=pasteboard
	else
		cat "$1" | $GREP -v '^\W*$' | $PERL -p -e 's/:.*$//g' >$f1
		_src="$1"
	fi
	l1=$(head -n1 $f1)
	tail -n $(echo "$(wc -l $f1 | $AWK '{print $1}')-1" | bc) $f1 >$f2
	mv $f2 $f1

	while IFS= read -r l2; do
		# echo "l1='$l1'; l2='$l2'"
		linesok=$(lines_in_order "$l1" "$l2")
		# echo "$linesok"
		if [[ "$linesok" == "0" ]]; then
			linesok=0
		else
			$PRINTF "%s\n\n" "ERROR, lines '$l1' and '$l2' are out of order" >/dev/stderr
			rm -Rf "$f1" "$f2"
			return 1
		fi
		l1="$l2"
		unset l2
	done <$f1
	rm -Rf "$f1" "$f2"
	$PRINTF "%s\n\n" "$_src lines were all listed in order"
	return 0
}

add_textblock() {
	(pbpaste && echo -e "\n\n") >>$HOME/src/ro-tools/data/text_phrases.txt
}
