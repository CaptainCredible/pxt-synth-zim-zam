let list = 0
let myOnTime = 0
let poly = false
let altTrack = 0
let myOnTimer = 0
//let perxles: neopixel.Strip = null
let midiChannel: midi.MidiController = null
let anOutputIsOn = false
let chan = 0
let MIDIoffset = 0
let muted = false
synthBlocks.importPresetString(SynthPreset.Sound1, "{ OscType::Saw, OscType::Triangle, 12.000000, 0.540000, 0.524000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, FilterType::LPF, 0.000000, 0.635184, 0.412000, 0.000000, 1.000000, 0.000000, 0.320000, 0.376000, 0.880000, OscType::Triangle, 0.000000, 13.720000, 0.000000, 0.500000, 0.000000, 0.076000, false }")
let lastNotePlayed = 0;
let notes: number[] = []

let perxles: neopixel.Strip = null
perxles = neopixel.create(DigitalPin.P1, 24, NeoPixelMode.RGB)
perxles.showRainbow(1, 360)
basic.pause(300)
turnOffAllLeds()

function handleNeoPixies() {
    for (let indeks = 0; indeks <= 2; indeks++) {
        perxles.setPixelColor(myNote % 17 + indeks, neopixel.colors(NeoPixelColors.Red))
        perxles.show()
    }
}


function handleOutput() {
    if (outPut > 1 && outPut < 126) {
        led.plot(0, outPut % 5)
        led.plot(1, outPut % 5)
        led.plot(2, outPut % 5)
        led.plot(3, outPut % 5)
        led.plot(4, outPut % 5)
        myOnTimer = input.runningTime() + myOnTime
        
        orchestra.setParameter(SynthPreset.Sound1, SynthParameter.EnvRelease, 0.3);
        myNote = outPut
        orchestra.note(myNote, 100, 127, SynthPreset.Sound1)
        handleNeoPixies();
        
        //sendMonoMidi()
        //handleNeoPixies()
    }
}

radio.onReceivedValue(function (name, value) {
    if (!muted) {
        if (name == "ZimP") {
            bitCheckMask = 1
            for (let i = 0; i <= 16 - 1; i++) {
                if (bitCheckMask & value) {
                    outPut = i
                    // outPut = 15-i //add this to flip output!
                    handleOutput()
                }
                bitCheckMask = bitCheckMask << 1
            }
        } else if (name == "Zim") {
            if (!(altTrack)) {
                outPut = value & 0b0000000011111111
            } else {
                outPut = value >> 8
            }
            if (outPut != 0) {
                handleOutput()
            }
        }
    }
    if (name == "m") {
        /*
        Bob 00000001
        Tim 00000010
        Ted 00000100
        Pat 00001000
        Cat 00010000
        Dad 00100000
        Mum 01000000
        Zim 10000000
        */
        if (value & 0b10000000) {
            muted = true
            basic.showIcon(IconNames.No, 1)
        } else {
            muted = false
            basic.clearScreen()
        }
    }


})


input.onButtonPressed(Button.A, function() {
    synthBlocks.importPresetString(SynthPreset.Sound1, "{ OscType::Pulse, OscType::Pulse, 0.192000, 0.500000, 0.552000, 0.000000, 0.000000, 0.300000, 0.300000, 0.000000, FilterType::LPF, 0.400000, 0.000000, 0.300000, 0.100000, 0.000000, 0.000000, 0.500000, 0.500000, 1.000000, OscType::Triangle, 3.220000, 13.560000, 0.184000, 0.500000, 0.000000, 0.000000, false }")
    synthBlocks.playSynthNote(Note.C, 200, 127, SynthPreset.Sound1)
})

input.onButtonPressed(Button.B, function() {
    synthBlocks.importPresetString(SynthPreset.Sound1, "{ OscType::Triangle, OscType::Triangle, 12.000000, 1.000000, 1.000000, 0.000000, 0.000000, 0.300000, 0.300000, 0.008000, FilterType::LPF, 0.208000, 0.000000, 0.596000, 0.000000, 1.000000, 0.000000, 0.100000, 0.192000, 1.020000, OscType::Triangle, 3.220000, 2.920000, 0.040000, 0.624000, 0.000000, 0.000000, false }")
})

function turnOffAllLeds() {
    //perxles.clear()
    //perxles.show()
}

let myPins: number[] = []
let outPut = 0
let myNote = 0
let bitCheckMask = 0
poly = false
basic.showLeds(`
    . . . . .
    . # . . .
    . # # . .
    . # # # .
    . . . . .
    `)
basic.pause(500)
myOnTime = 15
myPins = [9, 15, 20, 21, 22, 23]
list = 0
radio.setGroup(83)
basic.pause(300)
turnOffAllLeds()

basic.forever(() => {
    if (input.runningTime() > myOnTimer) {
        if (!muted) {
            basic.clearScreen()
        } else {
            basic.showIcon(IconNames.No, 1)
        }
        led.plot(0, 0)
        turnOffAllLeds()
        for (let offIndex = 0; offIndex <= 6 - 1; offIndex++) {
            pins.digitalWritePin(myPins[offIndex], 0)
        }
        anOutputIsOn = false
    }
})
