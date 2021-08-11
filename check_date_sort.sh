check_date_sort () 
{ 
    f1=$(mktemp);
    f2=$(mktemp);
    pbpaste | /usr/local/bin/ggrep --color=auto -v '^[[:space:]]*$' > f1;
    pbpaste | /usr/local/bin/ggrep --color=auto -v '^[[:space:]]*$' | sort -t '/' -k3,4g -k1,2g > f2;
    res=$(diff f1 f2 >/dev/null 2>&1; echo $?);
    if [[ $res > 0 ]]; then
        diff f1 f2;
    fi;
    rm f1 f2
}
