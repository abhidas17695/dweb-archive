import prettierBytes from "prettier-bytes";

require('babel-core/register')({ presets: ['env', 'react']}); // ES6 JS below!
import React from './ReactFake';
import Details from './Details'

/*
Support directories of files,
See https://github.com/internetarchive/dweb-archive/issues/10 for discussion - this is NOT complete yet, but works enough to use.
 */

export default class DownloadDirectory extends Details {
    theatreIaWrap() {
        const itemid = this.itemid;
        return (
            <div class="container container-ia">
                <div class="download-directory-listing">
                    <h1>Files for {itemid}</h1>
                    <hr />
                    <pre>
                        <table class="directory-listing-table">
                            <thead><th>Name</th>{/*--<th>Last modified</th>--*/}<th>Size</th></thead>
                            <tbody>
                                <tr>
                                    <td><a href="/details/commute">{/*TODO-DIR check this link*/}<span class="iconochive-Uplevel" title="Parent Directory" aria-hidden="true"></span> Go to parent directory</a></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                {/*-- TODO-DIR next loop needs doing --*/}
                                { this._list.map(f => (
                                    <tr>
                                    <td><a source={f}
                                           onClick="Nav.nav_download(this)"
                                           title={f.metadata.name}><span
                                        className="sr-only">download</span>{f.metadata.name}</a></td>{/*--TODO-DIR handle directory here as foo/ --*/}
                                        {/*--<td>00-Apr-0000 00:00{--TODO-DIR handle date from mtime </td>--*/}
                                    <td>{f.sizePretty()}{/*--TODO-DIR should be "-" for directory--*/}</td>
                                    </tr>
                                )) }
                            </tbody>
                        </table>
                    </pre>
                </div>
             {/*--/.container--*/}</div>
        );
    }

    itemDetailsAboutJSX() { } // Clear as not used in Directory
}
