#!/usr/bin/python3
""" Starts a Flash Web Application """
from models import storage
from models.state import State
from models.city import City
from models.amenity import Amenity
from models.place import Place
from os import environ
from flask import Flask, render_template
import uuid
app = Flask(__name__)
# app.jinja_env.trim_blocks = True
# app.jinja_env.lstrip_blocks = True


@app.teardown_appcontext
def close_db(error):
    """ Remove the current SQLAlchemy Session """
    storage.close()


@app.route('/4-hbnb', strict_slashes=False)
def hbnb():
    """ HBNB is alive! """
    states = storage.all(State).values()
    states = sorted(states, key=lambda k: k.name)
    st_ct = []

    for state in states:
        st_ct.append([state, sorted(state.cities, key=lambda k: k.name)])

    amenities = storage.all(Amenity).values()
    amenities = sorted(amenities, key=lambda k: k.name)

    places = storage.all(Place).values()
    places = sorted(places, key=lambda k: k.name)
    # To avoid asset caching done by flask, we add a
    # query string to each asset
    # In the html file 0-hbnb.html, cache_id is added as query string
    # to each <link> tag URL likein the following example
    # <link rel="icon" href="../static/images/icon.png?{{ cache_id }}" />
    cache_id = uuid.uuid4()
    return render_template('4-hbnb.html',
                           states=st_ct,
                           amenities=amenities,
                           places=places,
                           cache_id=cache_id)


if __name__ == "__main__":
    """ Main Function """
    app.run(host='0.0.0.0', port=5000)
