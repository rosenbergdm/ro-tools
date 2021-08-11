check_date_sort () 
{ 
    f1=$(mktemp);
    f2=$(mktemp);
    pbpaste | grep -P '^\d{2}\/\d{2}\/\d{4}' | grep -P -v '^\s*$' > $f1
    pbpaste | grep -P '^\d{2}\/\d{2}\/\d{4}' | grep -P -v '^\s*$' | sort -t '/' -k3,4g -k1,2g -k2,2g > $f2
    res=$(diff $f1 $f2 >/dev/null 2>&1; echo $?);
    if [[ $res > 0 ]]; then
       diff $f1 $f2;
    fi;
    return $res
}
