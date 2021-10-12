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
        let sub_cost = Number.MAX_VALUE;
        if (i > 0 && j > 0) sub_cost = res[i - 1][j - 1];  // move cursor left
        let del_cost = Number.MAX_VALUE;
        if (i > 0) del_cost = res[i - 1][j];               // backspace -- go up
        let ins_cost = Number.MAX_VALUE;
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

    let processed_out = Array();
    let backspaces = 0;
    let outtext = "";
    for (let i = 0; i < out.length; i++) {
        switch(out[i]) {
            case '-':
                backspaces++;
                break;
            case '<':
                processed_out.push(...("-".repeat(backspaces)), ...(outtext), ...("<".repeat(outtext.length + 1)));
                backspaces = 0;
                outtext = "";
                break;
            default:
                outtext = out[i] + outtext;
                break;
        }
    }
    processed_out.push(...("-".repeat(backspaces)), ...(outtext), ...("<".repeat(outtext.length)));
    
    return processed_out;
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
    constructor(elm, clean_link, speed) {
        this.elm = elm
        if (this.elm.attr('href')) this.link = this.elm.attr('href');
        else this.link = '';
        if (speed) this.speed = speed;
        else this.speed = 50;

        if (clean_link == undefined) {
            this.clean_link = this.link.replace('https://','').replace('http://','').replace('mailto:','');
        } else {
            this.clean_link = clean_link;
        }
        this.label = this.elm.text();
        this.cursor = new Cursor(this.elm);
        this.waiting = false;

        this.status = "free";
    }

    type_full() {
        //console.log("attempting to type")
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
        //console.log("trying to reset");
        if (this.status == "typing full") {
            setTimeout(function() {
                this.__reset();
            }.bind(this), 5000)
        } else if (this.status == "free"){
            this.status = "resetting"
            this.waiting = false;
            this.keytype_replace(this.label);
        }
    }

    keytype_replace(desired, cursor=this.cursor) {
        let original = cursor.text.replace('|','');
        let steps = find_diff(original, desired);
        
        //console.log(steps);

        let interval = 300;
        for (let i = 0; i < steps.length; i++) {
            switch(steps[i]) {
                case '-':
                    if (i > 0 && steps[i - 1] == '-') {
                        interval += this.speed + getRandomInt(10);
                    } else {
                        interval += this.speed * 2 + getRandomInt(10);
                    }
                    setTimeout(
                        function(){
                            cursor.backspace();
                        }, interval
                    );
                    break;
                case '<':
                    if (i > 0 && steps[i - 1] == '<') {
                        interval += this.speed + getRandomInt(10);
                    } else {
                        interval += this.speed * 2 + getRandomInt(10);
                    }
                    setTimeout(
                        function(){
                            cursor.move(-1)
                        }, interval
                    );
                    break;
                default:
                    if (i > 0 && steps[i - 1] != '<' && steps[i - 1] != '-') {
                        interval += this.speed;
                    } else {
                        interval += this.speed * 2;
                    }
                    setTimeout(
                        function(){
                            cursor.type(steps[i]);
                        }, interval
                    );
                    interval += this.speed / 2;
                    break;
            }
        }
        setTimeout(
            function(){cursor.move(1000); this.status = "free";}.bind(this), interval + 200
        );
    }
}

const address_syn = [
    "My Home",
    "My Location",
    "My Building Number",
    "My Abode",
    "My Direction",
    "My Domicile",
    "My Dwelling",
    "The Headquarters",
    "My House",
    "Lodging",
    "My Street",
    "Current Whereabouts",
    "My Box Number",
    "My Living Quarters",
    "Place of Business",
    "Place of Residence",
    "Address"
];

const desc_phrase = [
    "Computer Scientist specializing in HCI",
    "University of Tennessee's resident rapscallion",
    "Looking for a position as a PhD Student in HCI for the Fall of 2022",
    "B.S. in C.S. with Math & Philosophy Minor",
]

function make_link_fancy(id, lab) {
    elm = $("#" + id);
    let l = new FancyLink(elm, lab, 40);

    if (mobile) {
        elm.attr("href", "#");
        elm.click(function(){
            l.type_full();
            console.log(l.link);
            setTimeout(function(){
                l.elm.attr("href", l.link);
                }, 500
            );
            
        }.bind(l));
    } else {
        elm.mouseover(function(){
            l.type_full();
        });
    
        elm.mouseout(function(){
            l.reset();
        });
    }
}

function make_address_weird(id){
    elm = $("#" + id);
    let l = new FancyLink(elm);

    setInterval(() => {
      l.keytype_replace(address_syn[getRandomInt(address_syn.length - 1)]);  
    }, 5000);
}

function make_desc_weird(id){
    elm = $("#" + id);
    let l = new FancyLink(elm, undefined, 30);

    setInterval(() => {
      l.keytype_replace(desc_phrase[getRandomInt(desc_phrase.length - 1)]);  
    }, 10000);
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}