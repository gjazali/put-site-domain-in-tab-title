# Put Site Domain in Tab Title

You can install the Firefox add-on from
[here](https://addons.mozilla.org/en-US/firefox/addon/put-site-domain-in-tab-title/).

## Description

With this extension, tab titles will be prefixed with the domain name of the
site open in it.

The domain name will be enclosed in brackets and will appear before the actual
title (i.e., the tab title of [www.seas.upenn.edu](https://www.seas.upenn.edu)
will be `[seas.upenn.edu] Penn Engineering | Inventing the Future`).

The second-level domain will always be shown. However, whether or not the
third-level (and nth-level) domain will be shown depends on the total length of
the full domain name. The `www` part will never be shown as a part of the domain
name in the tab title (i.e., [www.google.com](https://www.google.com) will
appear as `google.com`).

## Use Cases

You might find this extension helpful if you've disabled favicons in your
browser for whatever reasons (e.g., privacy concerns due to
[supercookies](https://github.com/jonasstrehle/supercookie)).

## Configuration

You can specify what text prefixes the tab title for certain domains through the
preferences page of the add-on.

For example, to have [stackoverflow.com](https://stackoverflow.com) prefixed
with `[SO]` instead of the default `[stackoverflow.com]`, you can enter the
following in the preferences page:

```
stackoverflow.com=SO
```

You can specify as many exception rules as you like, each separated by a new
line:

```
stackoverflow.com=SO
github.com=GH
courses.upenn.edu=Path@Penn
```

By default, the domain appears before the tab title. To show it after the
title, select "Show the domain after the tab title" on the preferences page and
click Save. The tab title of [www.google.com](https://www.google.com) then
appears as `Google [google.com]`.
