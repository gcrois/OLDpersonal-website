function find_diff(dest, original) {
    let res = [];
    d_n = dest.length;
    o_n = original.length;

    for (let i = 0; i < d_n + 1; i++) {
        res.push(Array(o_n + 1));
    }

    for (let i = 0; i < d_n + 1; i++) {
        res[i][0] = i;
    }

    for (let i = 0; i < o_n + 1; i++) {
        res[0][i] = i;
    }

    for (let i = 1; i <= d_n; i++) {
        for (let j = 1; j <= o_n; j++) {
            let replace_cost = 1;
            if (dest[i - 1] == original[j - 1]) {
                replace_cost = 0;
            }

            res[i][j] = Math.min(
                res[i-1][j] + 1,
                res[i][j-1] + 1,
                res[i-1][j-1] + replace_cost
            )
        }
    }

    let i = res.length - 1, j = res[0].length - 1;

    let out = []

    while (res[i][j] != 0) {
        let sub_cost = 99999;
        if (i > 0 && j > 0) sub_cost = res[i - 1][j - 1];  // move cursor left
        let del_cost = 99999;
        if (i > 0) del_cost = res[i - 1][j];               // backspace -- go up
        let ins_cost = 99999;
        if (j > 0) ins_cost = res[i][j - 1];               // type

        if (sub_cost <= del_cost && sub_cost <= ins_cost) {
            if (res[i][j] == res[i - 1][j - 1]) {
                // console.log("cursor left");
                out.push('<');
            }
            else {
                // console.log("sub " + dest[i - 1] + " for " + original[j - 1], i, j);
                out.push('-'); out.push(original[j - 1]);
            }
            i--; j--;
        } else if (del_cost <= ins_cost) {
            //console.log("backspace");
            out.push('-');
            i--;
        } else {
            //console.log("type ", dest[i - i]);
            out.push(original[j - 1]);
            j--;
        }

        console.assert(i >= 0 && j >= 0, i, j)
        if (i < 0 || j < 0) {
            break;
        }
    }

    
    res[0].unshift('');
    for (let i = 1; i <= d_n; i++) {
    res[i].unshift(dest[i - 1]);
    }
    res.unshift(['', '', ...original])
    console.table(res);
    

    return out;
}

class Cursor{
    constructor(elm) {
        this.elm = elm;
        this.text = elm.text();
        this.loc = this.text.length;
        elm.text(this.text + '|');
        this.text = elm.text();
        this.busy = false;
    }

    backspace() {
        if (this.loc == 0) {throw "At the end! Can't backspace"}
        this.elm.text(this.text.substring(0,this.loc - 1) + '|' + this.text.substring(this.loc + 1, this.text.length));
        this.text = this.elm.text();
        this.loc--;
        console.assert(this.text[this.loc] == '|')

    }
    
    type(c) {
        this.elm.text(this.text.substring(0,this.loc) + c + '|' + this.text.substring(this.loc + 1, this.text.length));
        this.text = this.elm.text();
        this.loc++;
        console.assert(this.text[this.loc] == '|')

    }

    move(offset) {
        let newloc = this.loc + offset;
        newloc = Math.max(newloc, 0);
        newloc = Math.min(newloc, this.text.length - 1);

        this.text = this.text.substring(0, this.loc) + this.text.substring(this.loc + 1, this.text.length + 1);

        this.text = this.text.substring(0, newloc) + '|' + this.text.substring(newloc, this.text.length);
        this.elm.text(this.text);
        this.loc = newloc;
        console.assert(this.text[this.loc] == '|', "offset", this.loc)
    }
}

class FancyLink {
    constructor(elm) {
        this.elm = elm
        this.link = this.elm.attr('href');
        this.clean_link = this.link.replace('https://','').replace('http://','').replace('mailto:','');
        this.label = this.elm.text();
        this.cursor = new Cursor(this.elm);
        this.waiting = false;

        this.status = "free";
    }

    type_full() {
        console.log("attempting to type")
        if (this.status == "free") {
            this.status = "typing full";
            this.keytype_replace(this.clean_link);
        }
    }

    reset(){
        if (!this.waiting){
            if (this.status == "typing full") {
                this.waiting = true;
                this.__reset();
            }
        }
    }

    __reset(){
        console.log("trying to reset");
        if (this.status == "typing full") {
            setTimeout(function() {
                this.__reset();
            }.bind(this), 5000)
        } else if (this.status == "free"){
            this.waiting = false;
            this.keytype_replace(this.label);
        }
    }

    keytype_replace(desired, cursor=this.cursor) {
        let original = cursor.text.replace('|','');
        let steps = find_diff(original, desired);
        
        console.log(steps);

        let interval = 300;
        for (let i = 0; i < steps.length; i++) {
            interval += 50 + getRandomInt(30);
            switch(steps[i]) {
                case '-':
                    setTimeout(
                        function(){
                            cursor.backspace();
                        }, interval
                    );
                    break;
                case '<':
                    setTimeout(
                        function(){
                            cursor.move(-1)
                        }, interval
                    );
                    break;
                default:
                    setTimeout(
                        function(){
                            cursor.type(steps[i]);
                        }, interval
                    );
                    setTimeout(
                        function(){
                            cursor.move(-1)
                        }, interval + 20
                    );
                    interval += 20;
                    break;
            }
        }
        setTimeout(
            function(){cursor.move(1000); this.status = "free"; console.log(cursor.text)}.bind(this), interval + 200
        );
    }
}

function make_link_fancy(id) {
    elm = $("#" + id);
    let l = new FancyLink(elm);
    elm.mouseover(function(){
        l.type_full();
    });

    elm.mouseout(function(){
        l.reset();
    });
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

make_link_fancy("github");
make_link_fancy("twitter");
make_link_fancy("email");