require('babel-core/register')({ presets: ['env', 'react']}); // ES6 JS below!
import React from './ReactFake';

import AV from './AV'
import Util from './Util'

/* Notes on Audio
    - see also https://github.com/internetarchive/dweb-archive/issues/18

    TODO-AUDIO Audio html contains a lot of extra info in the "head" which we can't change on the fly, in particular the player is loaded there
    TODO-AUDIO Body tag on audio has different classes, in particular has <body navia ia-module tiles responsive jwaudio > and jwaudio might be important
    TODO-IA Ask Evan why item-details-about is now closed immediately
 */

export default class Audio extends AV {
    constructor(itemid, item) {
        super(itemid, item);
        this.itemtype = "http://schema.org/AudioObject";
    }

    setupPlaylist() {
        super.setupPlaylist("audio");
    }
    static play(elAnchor) {
        // Note - this is redirected from Nav which is a global
        let track = elAnchor.source;
        let af = track.sources[0].urls;
        document.getElementById("tracklist")
            .querySelectorAll(".jwrowV2")
            .forEach(el => el.classList.remove("playing"));
        elAnchor.querySelectorAll(".jwrowV2").forEach(el => el.classList.add("playing"));
        let elAudio = document.getElementById("streamContainer");
        React.loadStream(elAudio, af.metadata.name, af, undefined, undefined);
        return false;
    }


    theatreIaWrap() {
        /* Here's how it fits in on Images ... may be different on Audio
            wrap( TODO-DONATEBANNER | nav-wrap | maincontent | theatre-ia-wrap | item-details-about | TODO-ACTIONBUTTONS | TODO-ALSOFOUND  | TODO-ANALYTICS )
            item-details-about looks empty on the example chosen but that is a change in structure and maybe related to presence absence of forum etc
        */
        let item = this.item;
        let itemid = this.itemid;
        let detailsurl = `https://archive.org/details/${itemid}`;  //OK as absolute URL as only used as itemprop
        let title = item.metadata.title
        let imgurl = `https://archive.org/services/img/${itemid}`; //OK as absolute URL as only used as itemprop
        this.setupPlaylist();
        let af0 = this.playlist[0] && this.playlist[0].sources[0] && this.playlist[0].sources[0].urls;
        let initialPlay = 1;
        let trackCount = 1;
        return (
            <div id="theatre-ia-wrap" class="container container-ia width-max ">
                <link itemprop="url" href={detailsurl}/>{/*Link to archive.org directly*/}
                <link itemprop="image" href={imgurl}/>{/*Its unclear how/if this is used*/}
                {
                    this.playlist.map(track => ( // OK to be absolute or dweb link
                        <div itemprop="hasPart" itemscope itemtype="http://schema.org/AudioObject">
                            <meta itemprop="name" content={track.title}/>
                            <meta itemprop="duration" content={`PT0M${parseInt(track.duration)}S`}/>
                            {   // Loop over the sources which can be multiple files for the same track.  Note this is limited to playable sources, could add unplayable to playlist if want as seperate field e.g. unplayablesources
                                track.sources.map((f) => (
                                    <link itemprop="associatedMedia" href={`https://archive.org/download/${itemid}/${f.name}`}/>
                                ))
                            }
                        </div>
                    ))
                }
                <h1 class="sr-only">{title}</h1>
                <h2 class="sr-only">Audio Preview</h2>

                <div id="theatre-ia" class="container">
                    <div class="row">
                        <div class="xs-col-12">

                            <div id="theatre-controls">
                                <a href="#" onclick="return AJS.flash_click(0)">
                                    <div data-toggle="tooltip" data-container="body" data-placement="left" class="iconochive-flash"
                                         title="Click to have player try flash first, then HTML5 second"></div>
                                </a>
                                <a href="#" onclick="return AJS.mute_click()">
                                    <div data-toggle="tooltip" data-container="body" data-placement="left" class="iconochive-unmute"
                                         title="sound is on.  click to mute sound."></div>
                                </a>
                                <a href="#" onclick="return AJS.mute_click()">
                                    <div data-toggle="tooltip" data-container="body" data-placement="left" class="iconochive-mute"
                                         style="display:none" title="sound is off.  click for sound."></div>
                                </a>
                            </div>{/*--/#theatre-controls--*/}
                            <div class="row">
                                <div class="col-xs-12 col-sm-6 col-md-5 col-lg-4 audio-image-carousel-wrapper">
                                    <center>{/*--TODO-AUDIO replace image - see https://github.com/internetarchive/dweb-archive/issues/23--*/}
                                        <img src={item.metadata.thumbnaillinks}
                                            class="img-responsive"/>
                                    </center>
                                </div>
                                <div class="col-xs-12 col-sm-6 col-md-7 col-lg-8">
                                    <div id="audioContainer" style="text-align: center;">
                                        <audio id="streamContainer" src={af0} controls></audio>
                                    </div>
                                    <div id="webtorrentStats" style="color: white; text-align: center;"></div>
                                    <div id="jw6__list" class="jwlistV2"
                                        style="width: 100%; margin: auto; max-height: 240px; overflow-x: hidden; overflow-y: auto;">
                                        <div class="row" id="tracklist">
                                            <div class="col-sm-6">
                                                {
                                                    this.playlist.slice(0, (this.playlist.length+1)/2).map(track => (
                                                        <a href="#" source={track} onclick="return Nav.audioPlay(this);">
                                                            <div class={trackCount === initialPlay ? "jwrowV2 playing" : "jwrowV2" }>
                                                                <b>{trackCount++}</b>
                                                                <span class="ttl">{track.title}</span> - <span class="tm">{track.prettyduration}</span>
                                                            </div>
                                                        </a> ))
                                                }
                                            </div>
                                            <div class="col-sm-6">
                                                {
                                                    this.playlist.slice((this.playlist.length+1)/2).map(track => (
                                                        <a href="#" source={track} onclick="return Nav.audioPlay(this);">
                                                            <div class={trackCount === initialPlay ? "jwrowV2 playing" : "jwrowV2" }>
                                                                <b>{trackCount++}</b>
                                                                <span class="ttl">{track.title}</span> - <span class="tm">{track.prettyduration}</span>
                                                            </div>
                                                        </a> ))
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {this.cherModal("audio")}

                        </div>{/*--/.xs-col-12--*/}
                    </div>{/*--/.row--*/}

                </div>{/*--//#theatre-ia--*/}
                <div id="flag-overlay" class="center-area ">
                </div>
            {/*--//.container-ia--*/}</div>
        );
    }
}
